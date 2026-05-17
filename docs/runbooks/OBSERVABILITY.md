# Observability Runbook

## Backend logs

All ECS logs go to:

```text
/ecs/prod-digital-smart-city-api
```

Required log fields for future app enhancement:

```json
{
  "level": "info",
  "service": "digital-smart-city-api",
  "requestId": "uuid",
  "method": "GET",
  "path": "/healthz",
  "statusCode": 200,
  "latencyMs": 20
}
```

## Core CloudWatch Alarms

- ALB target 5xx > threshold
- ALB p95 latency > SLO
- ECS CPU > 75%
- ECS memory > 80%
- ECS unhealthy tasks > 0
- CodeDeploy deployment failure
- MongoDB Atlas replication lag / CPU / connection saturation

## Frontend errors

Use Sentry or CloudWatch RUM. The uploaded env already contains a Sentry DSN key name; store the actual value in Secrets Manager or frontend build env only if it is a public browser DSN.
