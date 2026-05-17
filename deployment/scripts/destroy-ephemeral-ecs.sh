#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT="${PROJECT:-digital-smart-city}"
ENVIRONMENT="${ENVIRONMENT:-ephemeral}"
TF_DIR="infra/terraform/envs/ephemeral"

cd "$(dirname "$0")/../.."
cd "$TF_DIR"
terraform init
terraform destroy -auto-approve \
  -var="aws_region=${AWS_REGION}" \
  -var="project=${PROJECT}" \
  -var="environment=${ENVIRONMENT}"

echo "[DONE] Terraform destroy completed. Check AWS console for stray Elastic IPs, log groups, and ECR images if you changed defaults."
