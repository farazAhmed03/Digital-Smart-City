#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT="${PROJECT:-digital-smart-city}"
ENVIRONMENT="${ENVIRONMENT:-ephemeral}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
ENV_FILE="${ENV_FILE:-deployment/env/.env.testing}"
TF_DIR="infra/terraform/envs/ephemeral"

command -v aws >/dev/null || { echo "[ERROR] aws cli missing" >&2; exit 1; }
command -v docker >/dev/null || { echo "[ERROR] docker missing" >&2; exit 1; }
command -v terraform >/dev/null || { echo "[ERROR] terraform missing" >&2; exit 1; }

cd "$(dirname "$0")/../.."

cd "$TF_DIR"
terraform init
terraform apply -target=module.ecr -target=module.secrets -auto-approve \
  -var="aws_region=${AWS_REGION}" \
  -var="project=${PROJECT}" \
  -var="environment=${ENVIRONMENT}"
BACKEND_REPO="$(terraform output -raw backend_ecr_repository_url)"
FRONTEND_REPO="$(terraform output -raw frontend_ecr_repository_url)"
cd - >/dev/null

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

BACKEND_IMAGE="${BACKEND_REPO}:${IMAGE_TAG}"
FRONTEND_IMAGE="${FRONTEND_REPO}:${IMAGE_TAG}"

echo "[INFO] Building backend image: $BACKEND_IMAGE"
docker build -f Backend/Dockerfile -t "$BACKEND_IMAGE" Backend

echo "[INFO] Building frontend image: $FRONTEND_IMAGE"
docker build -f Frontend/Dockerfile --build-arg REACT_APP_API_URL="" -t "$FRONTEND_IMAGE" Frontend

docker push "$BACKEND_IMAGE"
docker push "$FRONTEND_IMAGE"

if [ -f "$ENV_FILE" ]; then
  AWS_REGION="$AWS_REGION" PROJECT="$PROJECT" ENVIRONMENT="$ENVIRONMENT" deployment/scripts/seed-secrets.sh "$ENV_FILE"
else
  echo "[WARN] $ENV_FILE not found; ECS will start only if required secrets are already in AWS Secrets Manager."
fi

cd "$TF_DIR"
terraform apply -auto-approve \
  -var="aws_region=${AWS_REGION}" \
  -var="project=${PROJECT}" \
  -var="environment=${ENVIRONMENT}" \
  -var="backend_image=${BACKEND_IMAGE}" \
  -var="frontend_image=${FRONTEND_IMAGE}"
ALB_URL="$(terraform output -raw alb_url)"
cd - >/dev/null

echo "[INFO] ALB URL: $ALB_URL"
deployment/scripts/smoke-test.sh "$ALB_URL"

echo "[DONE] Ephemeral ECS Fargate + ALB environment is ready: $ALB_URL"
