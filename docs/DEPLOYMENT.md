# DevOps Deployment Guide — AWS EKS

End-to-end flow:

```
Developer Push → GitHub → CI (test/lint/security) → Docker Build → ECR → CD → EKS → Ingress → Domain
```

## Architecture

| Layer | Technology |
|-------|------------|
| CI/CD | GitHub Actions (`.github/workflows/ci-cd.yaml`) |
| Images | Docker → Amazon ECR |
| Orchestration | Amazon EKS (Kubernetes) |
| Ingress | AWS Load Balancer Controller (ALB) |
| Database | MongoDB Atlas (recommended) |
| Autoscaling | HPA (pods) + Cluster Autoscaler (nodes) |

| Host | Service |
|------|---------|
| `https://APP_DOMAIN` | React frontend (nginx) |
| `https://API_DOMAIN` | Express API + Socket.IO |

## GitHub repository variables

Set under **Settings → Secrets and variables → Actions → Variables**:

| Variable | Example | Required |
|----------|---------|----------|
| `AWS_REGION` | `us-east-1` | Yes |
| `EKS_CLUSTER_NAME` | `digital-smart-city-cluster` | Yes |
| `APP_DOMAIN` | `app.kohat.online` | Yes |
| `API_DOMAIN` | `api.kohat.online` | Yes |
| `ACM_CERTIFICATE_ARN` | `arn:aws:acm:us-east-1:123456789:certificate/...` | Yes for HTTPS |
| `ECR_BACKEND_REPOSITORY` | `digital-smart-city-backend` | Optional |
| `ECR_FRONTEND_REPOSITORY` | `digital-smart-city-frontend` | Optional |

## GitHub repository secrets

### AWS authentication (pick one)

**Option A — OIDC (recommended)**

| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN` | IAM role ARN trusted by GitHub OIDC |

**Option B — Access keys**

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |

### Application (required for deploy)

| Secret | Description |
|--------|-------------|
| `DB_URL` | MongoDB Atlas connection string |
| `JWT_KEY` | Strong random JWT secret |

### Application (optional)

| Secret | Description |
|--------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From address |

## GitHub environment

Create a **production** environment (optional approval gate) — the deploy job uses `environment: production`.

## One-time AWS setup

Follow [infra/README.md](../infra/README.md):

1. `eksctl create cluster -f infra/eksctl-cluster.yaml`
2. Install AWS Load Balancer Controller
3. Install Cluster Autoscaler
4. Request ACM certificate for app + API domains
5. Configure MongoDB Atlas + allow EKS egress IPs

## Pipeline jobs

| Job | Trigger | Actions |
|-----|---------|---------|
| `ci` | Every push/PR to `main` | Backend tests, Frontend test+build, npm audit, Trivy scan |
| `build-and-push` | Push to `main` | Build Backend + Frontend images, push to ECR |
| `deploy` | Push to `main` | Apply K8s manifests, rolling update, HPA |

## Local Docker (development)

```bash
docker compose up --build
```

Frontend: http://localhost  
Backend: http://localhost:5000

## Manual Kubernetes render (debug)

```bash
export BACKEND_IMAGE=123.dkr.ecr.us-east-1.amazonaws.com/digital-smart-city-backend:latest
export FRONTEND_IMAGE=123.dkr.ecr.us-east-1.amazonaws.com/digital-smart-city-frontend:latest
export APP_DOMAIN=app.example.com
export API_DOMAIN=api.example.com
export ACM_CERTIFICATE_ARN=arn:aws:acm:...
./scripts/render-k8s.sh
kubectl apply -f k8s-rendered/
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Ingress stays pending | Install AWS Load Balancer Controller; check IAM |
| CORS errors | Set `APP_DOMAIN` variable; ConfigMap `CORS_ORIGINS` must match |
| Socket.IO disconnects | ALB stickiness is enabled on API ingress |
| Pods CrashLoopBackOff | Check `kubectl logs -n digital-smart-city deployment/backend`; verify `DB_URL` |
| Image pull errors | EKS nodes need ECR read IAM permission |
