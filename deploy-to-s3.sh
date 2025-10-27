#!/bin/bash

# Set your S3 bucket name
BUCKET_NAME="your-bucket-name"

# Build the Next.js application
npm run build

# Navigate to the out directory
cd out

# Sync files to S3 bucket
aws s3 sync . s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000, immutable"

# Configure S3 bucket for static website hosting
aws s3 website s3://$BUCKET_NAME/ \
    --index-document index.html \
    --error-document 404.html

# Optional: Set bucket policy for public read access
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy "{
        \"Version\":\"2012-10-17\",
        \"Statement\":[{
            \"Sid\":\"PublicReadGetObject\",
            \"Effect\":\"Allow\",
            \"Principal\": \"*\",
            \"Action\":[\"s3:GetObject\"],
            \"Resource\":[\"arn:aws:s3:::$BUCKET_NAME/*\"]
        }]
    }"

echo "Deployment to S3 completed successfully!"
