---
name: deploy-aws
description: Host dist/index.html on AWS S3 + CloudFront (Batch 4).
---

# Deploy to AWS

- Static hosting only: private S3 bucket + CloudFront with origin access control, HTTPS, default root `index.html`. Cost is near zero for 12 users.
- Credentials: the owner adds an IAM user's keys (S3 + CloudFront only) as environment secrets. If they aren't there, write `tools/deploy.sh` (aws CLI: create bucket, upload with `Cache-Control: no-cache` on index.html, create/invalidate distribution) and hand it over; do not ask for keys in chat.
- Confirm with the owner before creating any AWS resource. Report the CloudFront URL.
