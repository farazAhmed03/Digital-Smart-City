# Digital Smart City - EC2 Docker Compose Deployment

## Architecture

```text
User
  ↓
EC2 Public IP :80
  ↓
Nginx container
  ├── /        → Frontend container :8080
  └── /api    → Backend container :3000
                 ↓
              MongoDB Atlas
```

## Required GitHub Secrets

Go to:

```text
GitHub Repo → Settings → Secrets and variables → Actions → Secrets
```

Add:

```text
EC2_HOST
EC2_USER
EC2_SSH_KEY
TESTING_ENV_FILE
```

Recommended values:

```text
EC2_HOST = your EC2 public IPv4 address
EC2_USER = ubuntu
EC2_SSH_KEY = full private key content from your .pem file
```

For Amazon Linux, use:

```text
EC2_USER = ec2-user
```

## Required EC2 Security Group

Inbound:

```text
22   SSH   Your IP only
80   HTTP  0.0.0.0/0
```

Optional later:

```text
443 HTTPS 0.0.0.0/0
```

## Required EC2 Size

Minimum:

```text
t3.micro / t2.micro
Ubuntu 22.04 LTS
20 GB gp3 EBS
```

Better:

```text
t3.small
```

## TESTING_ENV_FILE

Use only non-empty values:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=your_mongo_uri
DB_URL=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_KEY=your_jwt_secret
SESSION_SECRET=your_session_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
LOCAL_UPLOAD_PATH=uploads
MERCHANT_ID=your_merchant_id
MERCHANT_KEY=your_merchant_key
PAYFAST_URL=https://sandbox.payfast.co.za/eng/process
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SENTRY_DSN=your_sentry_dsn
```

Do not include blank SMTP values.

## Deploy

Push to main or run manually:

```text
Actions → deploy-ec2-docker-compose → Run workflow
```

## Test

```text
http://EC2_PUBLIC_IP
http://EC2_PUBLIC_IP/healthz
```

## Stop / Cleanup

SSH into EC2:

```bash
cd /opt/digital-smart-city
docker compose -f docker-compose.ec2.yml down --remove-orphans
```

To delete everything, terminate the EC2 instance.
