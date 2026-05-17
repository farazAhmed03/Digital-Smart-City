# Cost and Cleanup Notes

This environment is temporary and production-like, not free-only.

Resources that may cost money even for a short test:

- Application Load Balancer
- ECS Fargate task runtime
- Public IPv4 usage
- CloudWatch logs
- ECR image storage
- NAT Gateway is not used in this ephemeral design

Cost-control defaults:

```text
desired_count = 1
min_capacity  = 1
max_capacity  = 2
CloudWatch log retention = 3 days
No NAT Gateway
No domain
No ACM certificate
No Route53
```

Destroy command:

```bash
deployment/scripts/destroy-ephemeral-ecs.sh
```

If you want a real HA proof, set:

```text
desired_count = 2
```

That starts two Fargate tasks behind the ALB.
