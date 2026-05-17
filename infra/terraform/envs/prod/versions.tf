terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "replace-prod-terraform-state-bucket"
    key            = "digital-smart-city/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "replace-prod-terraform-locks"
    encrypt        = true
  }
}
