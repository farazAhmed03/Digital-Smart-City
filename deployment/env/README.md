# Environment Handling Policy

The user-provided `All Use ENV.txt` is treated as a test/overall runtime source only.
Do not commit real secrets into GitHub, Docker images, Terraform state, or CI logs.

## What was normalized

The backend now supports both production names and the uploaded env names:

| Application expects | Uploaded env alternative |
|---|---|
| `DB_URL` | `MONGO_URI` |
| `JWT_KEY` | `JWT_SECRET`, `SESSION_SECRET` |
| `CLOUDINARY_CLOUD_NAME` | `CLOUDINARY_NAME` |
| `SMTP_USER` | `SMTP_MAIL`, `MAIL_USER` |
| `SMTP_PASS` | `SMTP_PASSWORD`, `MAIL_PASS` |
| `SMTP_FROM` | `MAIL_FROM` |

## Production rule

Store real values in AWS Secrets Manager under:

```text
/prod/digital-smart-city/api/DB_URL
/prod/digital-smart-city/api/JWT_KEY
/prod/digital-smart-city/api/SESSION_SECRET
/prod/digital-smart-city/api/CLOUDINARY_CLOUD_NAME
/prod/digital-smart-city/api/CLOUDINARY_API_KEY
/prod/digital-smart-city/api/CLOUDINARY_API_SECRET
/prod/digital-smart-city/api/SMTP_HOST
/prod/digital-smart-city/api/SMTP_USER
/prod/digital-smart-city/api/SMTP_PASS
/prod/digital-smart-city/api/STRIPE_SECRET_KEY
/prod/digital-smart-city/api/SENTRY_DSN
```

## Critical security note

Because test credentials were shared in plaintext, rotate MongoDB, Cloudinary, Stripe, SMTP, PayFast, and Sentry keys before a real production launch.
