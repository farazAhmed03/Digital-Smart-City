# Client Explanation

The original website remains untouched:

```text
https://www.kohat.online/
```

A separate AWS pre-production environment is created using:

```text
Terraform + ECS Fargate + ALB + ECR + Secrets Manager + CloudWatch
```

Testing URL:

```text
http://<aws-alb-url>
```

After validation, resources can be destroyed to avoid cost.

When the client approves production transfer in the future, DNS and SSL can be added separately.
