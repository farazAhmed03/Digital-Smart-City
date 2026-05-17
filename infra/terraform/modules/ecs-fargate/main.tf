variable "project" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "alb_certificate_arn" { type = string }
variable "api_domain" { type = string }
variable "container_image" { type = string }
variable "secret_arns" { type = map(string) }

locals { name = "${var.environment}-${var.project}" }

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${local.name}-api"
  retention_in_days = 180
}

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb-sg"
  description = "Public HTTPS to ALB"
  vpc_id      = var.vpc_id
  ingress { from_port = 443 to_port = 443 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_security_group" "service" {
  name        = "${local.name}-api-sg"
  description = "ALB to API only"
  vpc_id      = var.vpc_id
  ingress { from_port = 5000 to_port = 5000 protocol = "tcp" security_groups = [aws_security_group.alb.id] }
  egress  { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_lb" "api" {
  name               = substr("${local.name}-api-alb", 0, 32)
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
  enable_deletion_protection = true
}

resource "aws_lb_target_group" "blue" {
  name        = substr("${local.name}-blue", 0, 32)
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check { path = "/healthz" matcher = "200" interval = 30 timeout = 5 healthy_threshold = 2 unhealthy_threshold = 3 }
}

resource "aws_lb_target_group" "green" {
  name        = substr("${local.name}-green", 0, 32)
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check { path = "/healthz" matcher = "200" interval = 30 timeout = 5 healthy_threshold = 2 unhealthy_threshold = 3 }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.api.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.alb_certificate_arn
  default_action { type = "forward" target_group_arn = aws_lb_target_group.blue.arn }
}

resource "aws_ecs_cluster" "this" {
  name = "${local.name}-cluster"
  setting { name = "containerInsights" value = "enabled" }
}

resource "aws_iam_role" "execution" {
  name = "${local.name}-ecs-execution-role"
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Principal = { Service = "ecs-tasks.amazonaws.com" }, Action = "sts:AssumeRole" }] })
}
resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
resource "aws_iam_role_policy" "execution_secrets" {
  role = aws_iam_role.execution.id
  policy = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Action = ["secretsmanager:GetSecretValue"], Resource = values(var.secret_arns) }] })
}

resource "aws_iam_role" "task" {
  name = "${local.name}-ecs-task-role"
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Principal = { Service = "ecs-tasks.amazonaws.com" }, Action = "sts:AssumeRole" }] })
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([{ 
    name = "api", image = var.container_image, essential = true,
    portMappings = [{ containerPort = 5000, protocol = "tcp" }],
    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "PORT", value = "5000" },
      { name = "CORS_ORIGINS", value = "https://${var.api_domain}" }
    ],
    secrets = [for k, arn in var.secret_arns : { name = k, valueFrom = arn }],
    logConfiguration = { logDriver = "awslogs", options = { awslogs-group = aws_cloudwatch_log_group.api.name, awslogs-region = data.aws_region.current.name, awslogs-stream-prefix = "api" }},
    healthCheck = { command = ["CMD-SHELL", "wget -qO- http://127.0.0.1:5000/healthz || exit 1"], interval = 30, timeout = 5, retries = 3, startPeriod = 60 }
  }])
}

data "aws_region" "current" {}

resource "aws_ecs_service" "api" {
  name            = "${local.name}-api"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  deployment_controller { type = "CODE_DEPLOY" }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.service.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.blue.arn
    container_name   = "api"
    container_port   = 5000
  }

  lifecycle { ignore_changes = [task_definition, load_balancer] }
}

resource "aws_appautoscaling_target" "api" {
  max_capacity       = 20
  min_capacity       = 3
  resource_id        = "service/${aws_ecs_cluster.this.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "${local.name}-api-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  target_tracking_scaling_policy_configuration { predefined_metric_specification { predefined_metric_type = "ECSServiceAverageCPUUtilization" } target_value = 60 }
}

output "cluster_name" { value = aws_ecs_cluster.this.name }
output "service_name" { value = aws_ecs_service.api.name }
output "alb_arn_suffix" { value = aws_lb.api.arn_suffix }
output "target_group_arn_suffix" { value = aws_lb_target_group.blue.arn_suffix }
