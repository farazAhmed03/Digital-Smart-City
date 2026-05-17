variable "aws_region" {
  type        = string
  description = "AWS region for the temporary environment. Use the closest/cheapest region, e.g. us-east-1, ap-south-1, eu-west-1."
  default     = "us-east-1"
}

variable "project" {
  type    = string
  default = "digital-smart-city"
}

variable "environment" {
  type    = string
  default = "ephemeral"
}

variable "vpc_cidr" {
  type    = string
  default = "10.70.0.0/16"
}

variable "backend_image" {
  type        = string
  description = "Fully qualified backend image URI. Filled by deployment script after ECR push."
  default     = "public.ecr.aws/docker/library/nginx:stable-alpine"
}

variable "frontend_image" {
  type        = string
  description = "Fully qualified frontend image URI. Filled by deployment script after ECR push."
  default     = "public.ecr.aws/docker/library/nginx:stable-alpine"
}

variable "desired_count" {
  type        = number
  description = "Use 1 for 15-minute cost-controlled proof. Use 2 if you need real multi-task HA proof."
  default     = 1
}

variable "min_capacity" {
  type    = number
  default = 1
}

variable "max_capacity" {
  type    = number
  default = 2
}

variable "secret_names" {
  type = list(string)
  default = [
    "DB_URL",
    "MONGO_URI",
    "JWT_KEY",
    "JWT_SECRET",
    "SESSION_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_MAIL",
    "SMTP_PASSWORD",
    "STRIPE_PUBLIC_KEY",
    "STRIPE_SECRET_KEY",
    "SENTRY_DSN",
    "MERCHANT_ID",
    "MERCHANT_KEY",
    "PAYFAST_URL",
    "LOCAL_UPLOAD_PATH"
  ]
}
