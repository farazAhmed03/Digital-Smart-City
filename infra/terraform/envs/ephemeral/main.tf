provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Purpose     = "ephemeral-preprod-test"
      AutoDestroy = "manual-after-smoke-test"
    }
  }
}

locals {
  name = "${var.environment}-${var.project}"
}

module "vpc" {
  source = "../../modules/vpc-lite"
  name   = local.name
  cidr   = var.vpc_cidr
}

module "ecr" {
  source       = "../../modules/ecr"
  project      = var.project
  environment  = var.environment
  repositories = ["backend", "frontend"]
}

module "secrets" {
  source       = "../../modules/secrets"
  project      = var.project
  environment  = var.environment
  secret_names = var.secret_names
}

module "ecs" {
  source            = "../../modules/ecs-fargate-alb-ephemeral"
  project           = var.project
  environment       = var.environment
  aws_region        = var.aws_region
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids

  backend_image  = var.backend_image
  frontend_image = var.frontend_image

  desired_count = var.desired_count
  min_capacity  = var.min_capacity
  max_capacity  = var.max_capacity

  secret_arns = module.secrets.secret_arns
}
