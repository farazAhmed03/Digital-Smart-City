# AWS Keys, Access, and Region Guide

## Best option: GitHub OIDC role

Do not put permanent AWS access keys in GitHub if you can avoid it.

Use:

```text
GitHub Actions -> AWS OIDC -> IAM Role -> temporary credentials
```

GitHub secret needed:

```text
AWS_ROLE_ARN=arn:aws:iam::<ACCOUNT_ID>:role/github-digital-smart-city-ephemeral-deploy
```

Templates are provided:

```text
infra/iam/github-oidc-trust-policy.template.json
infra/iam/github-ephemeral-deploy-policy.template.json
```

Replace:

```text
<AWS_ACCOUNT_ID>
<GITHUB_ORG_OR_USER>
<REPO_NAME>
```

## Simple option for quick local deployment

For laptop deployment, run:

```bash
aws configure
```

You need an IAM user or role with permissions to create:

- VPC
- Subnets
- Internet Gateway
- Security Groups
- ALB
- Target Groups
- ECS Cluster/Service/Task Definition
- ECR repositories
- CloudWatch Logs
- Secrets Manager secrets
- IAM roles for ECS task execution

## Region selection

Recommended for this temporary proof:

```text
us-east-1
```

Reason:

- usually lowest friction
- most services available
- common default for examples

Alternative:

```text
ap-south-1
```

Reason:

- closer latency for Pakistan/India region

Keep one region consistent across:

```text
AWS_REGION
Terraform variable aws_region
GitHub workflow input aws_region
AWS console checks
```
