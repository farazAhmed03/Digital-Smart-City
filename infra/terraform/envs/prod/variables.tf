variable "aws_region" { type = string default = "us-east-1" }
variable "project" { type = string default = "digital-smart-city" }
variable "environment" { type = string default = "prod" }
variable "domain_name" { type = string default = "example.com" }
variable "frontend_domain" { type = string default = "app.example.com" }
variable "api_domain" { type = string default = "api.example.com" }
variable "alb_certificate_arn" { type = string }
variable "cloudfront_certificate_arn" { type = string }
variable "container_image" { type = string default = "public.ecr.aws/docker/library/node:22-alpine" }
