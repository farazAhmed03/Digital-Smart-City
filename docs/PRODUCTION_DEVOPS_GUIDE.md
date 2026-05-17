# Digital Smart City - Production DevOps Guide

## Target Architecture

```text
React Frontend -> S3 private origin -> CloudFront + ACM + WAF
Node/Express API -> ALB HTTPS -> ECS Fargate private subnets
MongoDB -> MongoDB Atlas through PrivateLink/VPC Peering
Secrets -> AWS Secrets Manager
Logs/Metrics -> CloudWatch + optional Sentry
CI/CD -> GitHub Actions OIDC -> ECR -> ECS CodeDeploy Blue/Green
IaC -> Terraform
```

## Separation of Concerns

```text
Backend/                 Application API only
Frontend/                React application only
infra/terraform/         AWS infrastructure only
deployment/              ECS task/appspec/env templates only
.github/workflows/       CI/CD only
docs/runbooks/           operational procedures only
security/                security scanning/policy files only
```

## Required AWS Prerequisites

1. AWS account with separate prod IAM role for deployment.
2. S3 bucket and DynamoDB table for Terraform remote state.
3. ACM cert for CloudFront in `us-east-1`.
4. ACM cert for ALB in workload region.
5. MongoDB Atlas cluster with private connectivity.
6. GitHub OIDC role with least-privilege permissions.

## First-Time Deployment Order

1. Create remote state bucket and lock table.
2. Update `infra/terraform/envs/prod/versions.tf` backend names.
3. Update `infra/terraform/envs/prod/terraform.tfvars` or pass variables.
4. Run Terraform:

```bash
cd infra/terraform/envs/prod
terraform init
terraform plan
terraform apply
```

5. Store all runtime secrets in AWS Secrets Manager.
6. Update `.github/workflows/deploy-prod.yml` values:
   - `FRONTEND_BUCKET`
   - `CLOUDFRONT_DISTRIBUTION_ID`
   - `ECS_CLUSTER`
   - `ECS_SERVICE`
   - `CODEDEPLOY_APPLICATION`
   - `CODEDEPLOY_DEPLOYMENT_GROUP`
   - `REACT_APP_API_URL`
7. Push to `main` to deploy.

## MongoDB Atlas Policy

Use Atlas PrivateLink where possible. Public `0.0.0.0/0` access is forbidden for production.

## Secret Handling

Real `.env` files are not committed. The uploaded test env names are supported through `Backend/config/env.js`, but production values must live in AWS Secrets Manager.

## Health Checks

Backend exposes:

```text
GET /healthz
```

ALB target groups and ECS health checks use this endpoint.
