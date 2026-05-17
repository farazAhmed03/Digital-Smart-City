terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # For the fastest disposable test, local state is acceptable.
  # For team/shared usage, uncomment backend "s3" and create the state bucket first.
  # backend "s3" {
  #   bucket         = "REPLACE_WITH_TERRAFORM_STATE_BUCKET"
  #   key            = "digital-smart-city/ephemeral/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "REPLACE_WITH_TERRAFORM_LOCK_TABLE"
  #   encrypt        = true
  # }
}
