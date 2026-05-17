# Disaster Recovery and Backup

## RPO/RTO Targets

| Component | RPO | RTO |
|---|---:|---:|
| Frontend | 0-15 min | 15 min |
| Backend ECS | 0 min | 30-60 min |
| MongoDB Atlas | 5-15 min | 30-60 min |

## Backup Strategy

- S3 frontend bucket versioning enabled.
- ECR immutable image tags retained.
- ECS task definition revisions retained.
- Terraform state versioned in S3.
- MongoDB Atlas continuous backups and PITR enabled.

## Regional DR

Warm standby recommended:

```text
Primary: us-east-1
DR: us-west-2
CloudFront: global
Backend: ECS service pre-provisioned in DR
MongoDB: Atlas multi-region or cross-region backup restore
Route53: failover routing
```
