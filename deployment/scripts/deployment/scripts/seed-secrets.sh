#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-deployment/env/.env.testing}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT="${PROJECT:-digital-smart-city}"
ENVIRONMENT="${ENVIRONMENT:-ephemeral}"
PREFIX="/${ENVIRONMENT}/${PROJECT}/api"

if [ ! -f "$ENV_FILE" ]; then
  echo "[ERROR] Env file not found: $ENV_FILE" >&2
  echo "Create it from deployment/env/.env.testing.example" >&2
  exit 1
fi

declare -A ENV_MAP

while IFS='=' read -r key raw_value; do
  key="$(echo "$key" | xargs)"
  [ -z "$key" ] && continue
  case "$key" in \#*) continue ;; esac
  value="${raw_value:-}"
  value="${value%$'\r'}"
  value="${value%\"}"
  value="${value#\"}"
  ENV_MAP["$key"]="$value"
done < "$ENV_FILE"

# Compatibility aliases between the user's test env naming and the application naming.
[ -z "${ENV_MAP[DB_URL]:-}" ] && ENV_MAP[DB_URL]="${ENV_MAP[MONGO_URI]:-}"
[ -z "${ENV_MAP[MONGO_URI]:-}" ] && ENV_MAP[MONGO_URI]="${ENV_MAP[DB_URL]:-}"
[ -z "${ENV_MAP[JWT_KEY]:-}" ] && ENV_MAP[JWT_KEY]="${ENV_MAP[JWT_SECRET]:-}"
[ -z "${ENV_MAP[JWT_SECRET]:-}" ] && ENV_MAP[JWT_SECRET]="${ENV_MAP[JWT_KEY]:-}"
[ -z "${ENV_MAP[CLOUDINARY_CLOUD_NAME]:-}" ] && ENV_MAP[CLOUDINARY_CLOUD_NAME]="${ENV_MAP[CLOUDINARY_NAME]:-}"
[ -z "${ENV_MAP[CLOUDINARY_NAME]:-}" ] && ENV_MAP[CLOUDINARY_NAME]="${ENV_MAP[CLOUDINARY_CLOUD_NAME]:-}"
[ -z "${ENV_MAP[SMTP_USER]:-}" ] && ENV_MAP[SMTP_USER]="${ENV_MAP[SMTP_MAIL]:-}"
[ -z "${ENV_MAP[SMTP_MAIL]:-}" ] && ENV_MAP[SMTP_MAIL]="${ENV_MAP[SMTP_USER]:-}"
[ -z "${ENV_MAP[SMTP_PASS]:-}" ] && ENV_MAP[SMTP_PASS]="${ENV_MAP[SMTP_PASSWORD]:-}"
[ -z "${ENV_MAP[SMTP_PASSWORD]:-}" ] && ENV_MAP[SMTP_PASSWORD]="${ENV_MAP[SMTP_PASS]:-}"

REQUIRED_KEYS=(
  DB_URL MONGO_URI JWT_KEY JWT_SECRET SESSION_SECRET
  CLOUDINARY_CLOUD_NAME CLOUDINARY_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET
  SMTP_HOST SMTP_USER SMTP_PASS SMTP_MAIL SMTP_PASSWORD
  STRIPE_PUBLIC_KEY STRIPE_SECRET_KEY SENTRY_DSN
  MERCHANT_ID MERCHANT_KEY PAYFAST_URL LOCAL_UPLOAD_PATH
)

put_secret() {
  local key="$1"
  local value="${2:-}"
  local name="${PREFIX}/${key}"
  if aws secretsmanager describe-secret --secret-id "$name" --region "$AWS_REGION" >/dev/null 2>&1; then
    aws secretsmanager put-secret-value --secret-id "$name" --secret-string "$value" --region "$AWS_REGION" >/dev/null
  else
    aws secretsmanager create-secret --name "$name" --secret-string "$value" --region "$AWS_REGION" >/dev/null
  fi
  echo "[OK] seeded $name"
}

for key in "${REQUIRED_KEYS[@]}"; do
  value="${ENV_MAP[$key]:-}"
  if [ -z "$value" ]; then
    echo "[WARN] Skipping $key - value is empty"
    continue
  fi
  put_secret "$key" "$value"
done
