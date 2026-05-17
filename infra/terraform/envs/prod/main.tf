provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = "platform-engineering"
    }
  }
}

module "vpc" {
  source = "../../modules/vpc"
  name   = "${var.environment}-${var.project}"
  cidr   = "10.40.0.0/16"
}

module "ecr" {
  source       = "../../modules/ecr"
  project      = var.project
  environment  = var.environment
  repositories = ["backend", "frontend"]
}

module "secrets" {
  source      = "../../modules/secrets"
  project     = var.project
  environment = var.environment
  secret_names = [
    "DB_URL",
    "JWT_KEY",
    "SESSION_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "STRIPE_SECRET_KEY",
    "SENTRY_DSN"
  ]
}

module "frontend" {
  source                    = "../../modules/s3-cloudfront"
  project                   = var.project
  environment               = var.environment
  frontend_domain           = var.frontend_domain
  cloudfront_certificate_arn = var.cloudfront_certificate_arn
}

module "ecs" {
  source              = "../../modules/ecs-fargate"
  project             = var.project
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  private_subnet_ids  = module.vpc.private_subnet_ids
  alb_certificate_arn = var.alb_certificate_arn
  api_domain          = var.api_domain
  container_image     = var.container_image
  secret_arns         = module.secrets.secret_arns
}

module "monitoring" {
  source             = "../../modules/monitoring"
  project            = var.project
  environment        = var.environment
  alb_arn_suffix     = module.ecs.alb_arn_suffix
  target_group_suffix = module.ecs.target_group_arn_suffix
}
