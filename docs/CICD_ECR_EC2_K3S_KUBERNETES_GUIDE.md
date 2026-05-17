# CI/CD -> ECR -> EC2 k3s Kubernetes Deployment

## Flow

```text
GitHub Actions
  -> CI checks
  -> Docker build from Backend/Dockerfile and Frontend/Dockerfile
  -> Push images to Amazon ECR
  -> SSH to EC2
  -> Install/verify k3s Kubernetes
  -> Create app-env secret from TESTING_ENV_FILE
  -> Create ECR imagePullSecret
  -> kubectl apply backend/frontend/ingress
  -> Traefik ingress exposes app on EC2 port 80
```

## Required GitHub Secrets

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
EC2_HOST
EC2_USER
EC2_SSH_KEY
TESTING_ENV_FILE
```

## Required GitHub Variables

```text
AWS_REGION = us-east-1
PROJECT = digital-smart-city
ENVIRONMENT = ephemeral
```

## EC2 Security Group

```text
22 SSH   your IP / GitHub runner access
80 HTTP  0.0.0.0/0
```

## URL

```text
http://EC2_PUBLIC_IP
http://EC2_PUBLIC_IP/healthz
```

## Kubernetes resources

```text
namespace: digital-smart-city
deployment/backend
deployment/frontend
service/backend
service/frontend
ingress/digital-smart-city
secret/app-env
secret/ecr-registry
```

## Commands on EC2

```bash
kubectl get nodes
kubectl -n digital-smart-city get all,ingress
kubectl -n digital-smart-city logs deploy/backend --tail=100
kubectl -n digital-smart-city logs deploy/frontend --tail=100
```

## Cleanup

```bash
kubectl delete namespace digital-smart-city
```

To fully remove k3s:

```bash
sudo /usr/local/bin/k3s-uninstall.sh
```
