# Digital Smart City - Ephemeral ECS Fargate + ALB Deployment Guide

## Goal

This package creates a temporary, production-like cloud deployment for validation only.

It does **not** touch the original domain:

```text
https://www.kohat.online/
```

The test URL comes from AWS ALB:

```text
http://<generated-alb-dns-name>.elb.amazonaws.com
```

## Architecture

```text
GitHub Actions or local CLI
  -> Terraform
  -> ECR repositories
  -> Secrets Manager secrets
  -> VPC lite, public subnets, Internet Gateway
  -> Application Load Balancer
  -> ECS Fargate service
  -> One ECS task with two containers:
       frontend nginx container
       backend Node.js container
  -> MongoDB Atlas test database
```

The frontend and backend are in one ECS task so the application can use one ALB URL without a domain or subdomain.

```text
ALB :80
  -> frontend nginx :8080
       -> serves React files
       -> proxies API routes and /healthz to backend :5000
```

## Why this is production-like

- ALB health checks
- ECS service auto-healing
- ECS Service Auto Scaling target policy
- CloudWatch logs
- Secrets Manager runtime secrets
- Immutable Docker images in ECR
- Terraform destroy for cleanup

## Why this is not the final permanent production architecture

This is intentionally disposable and cost-controlled.

For a permanent setup, use:

```text
S3 + CloudFront frontend
ALB + ECS Fargate backend
MongoDB Atlas PrivateLink / VPC peering
ACM TLS certificate
Route53 DNS
```

## One-time AWS prerequisites

Install locally if deploying from your laptop:

```bash
aws --version
terraform version
docker version
```

Configure AWS:

```bash
aws configure
```

Recommended AWS region:

```text
us-east-1      usually cheapest/common
ap-south-1     closer to Pakistan/India region
me-south-1     Middle East, can be more expensive/limited
```

For a 15-minute proof, use `us-east-1` unless the client requires another region.

## Local deployment commands

From repository root:

```bash
cp deployment/env/.env.testing.example deployment/env/.env.testing
# paste the testing values into deployment/env/.env.testing

export AWS_REGION=us-east-1
export PROJECT=digital-smart-city
export ENVIRONMENT=ephemeral

deployment/scripts/deploy-ephemeral-ecs.sh
```

At the end, the script prints:

```text
http://<alb-dns-name>
```

Open that URL in browser.

## Smoke tests

The deployment script automatically runs:

```bash
deployment/scripts/smoke-test.sh http://<alb-dns-name>
```

Checks:

- `/healthz` returns HTTP 200
- frontend HTML loads

Manual checks:

- Homepage opens
- Login/register screen opens
- MongoDB-backed actions work
- Cloudinary upload works
- Payment sandbox URLs do not break
- Browser console has no critical errors
- ECS service shows healthy task
- ALB target group shows healthy target

## Destroy after testing

After test/demo:

```bash
export AWS_REGION=us-east-1
export PROJECT=digital-smart-city
export ENVIRONMENT=ephemeral

deployment/scripts/destroy-ephemeral-ecs.sh
```

Then check AWS console for:

- ECS service deleted
- ALB deleted
- Target group deleted
- VPC deleted
- Security groups deleted
- CloudWatch log groups, if you want to remove logs
- ECR images, if you want to remove stored images

## GitHub Actions deployment

Required GitHub secret:

```text
AWS_ROLE_ARN
TESTING_ENV_FILE
```

`TESTING_ENV_FILE` should contain the complete testing env content, same as `deployment/env/.env.testing`.

Run:

```text
Actions -> deploy-ephemeral-ecs -> Run workflow
```

Set:

```text
aws_region = us-east-1
destroy_after_test = false
```

For automatic cleanup after smoke test:

```text
destroy_after_test = true
```

## Important secret warning

Do not commit real `.env.testing`.

Only commit:

```text
deployment/env/.env.testing.example
```
