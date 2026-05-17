# GitHub Actions ECS Fargate Ephemeral Deployment

This repository is cleaned for ECS Fargate + ALB temporary deployment only.

Active workflows:

- `.github/workflows/deploy-ephemeral-ecs.yml`
  - Runs on push to `main`
  - Can also be run manually
  - Builds Docker images on GitHub runner
  - Pushes images to ECR
  - Runs Terraform
  - Deploys ECS Fargate service behind ALB
  - Runs smoke test and prints ALB URL

- `.github/workflows/destroy-ephemeral-ecs.yml`
  - Manual only
  - Runs Terraform destroy

No EC2 SSH workflow is active. There is no `appleboy/ssh-action` in this package.

## Required GitHub Secrets

Repository → Settings → Secrets and variables → Actions → Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `TESTING_ENV_FILE`

Paste only test values in `TESTING_ENV_FILE`. Do not commit `.env.testing`.

## Required GitHub Variables

Repository → Settings → Secrets and variables → Actions → Variables:

- `AWS_REGION` = `us-east-1`
- `PROJECT` = `digital-smart-city`
- `ENVIRONMENT` = `ephemeral`

## Runtime ports

- ALB public URL: HTTP port `80`
- Frontend Nginx container: `8080`
- Backend Node.js container: `3000`

The user opens only the ALB URL. No domain/subdomain is required.

## After testing

Run the `destroy-ephemeral-ecs-fargate-alb` workflow manually to delete temporary AWS resources.
