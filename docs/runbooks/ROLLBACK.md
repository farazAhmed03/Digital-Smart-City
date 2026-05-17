# Rollback Runbook

## Backend automatic rollback

CodeDeploy should rollback automatically when ALB health checks fail or the deployment alarm enters ALARM.

## Backend manual rollback

```bash
aws deploy stop-deployment \
  --deployment-id "$DEPLOYMENT_ID" \
  --auto-rollback-enabled
```

Or redeploy a previous task definition revision:

```bash
aws ecs update-service \
  --cluster prod-digital-smart-city-cluster \
  --service prod-digital-smart-city-api \
  --task-definition prod-digital-smart-city-api:PREVIOUS_REVISION \
  --force-new-deployment
```

## Frontend rollback

Restore previous S3 `index.html` object version and invalidate CloudFront:

```bash
aws s3api list-object-versions --bucket prod-digital-smart-city-frontend-origin --prefix index.html
aws s3api copy-object \
  --bucket prod-digital-smart-city-frontend-origin \
  --copy-source prod-digital-smart-city-frontend-origin/index.html?versionId=PREVIOUS_VERSION_ID \
  --key index.html
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/" "/index.html"
```

## Database rollback

Do not blindly rollback database writes. Restore Atlas PITR into a temporary cluster, validate, then promote only after business approval.
