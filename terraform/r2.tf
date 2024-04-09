resource "aws_s3_bucket" "image" {
  bucket   = "yourspot-dev"
  provider = cloudflarer2

  object_lock_enabled = false
  tags                = {}
  tags_all            = {}
}

resource "aws_s3_bucket_versioning" "image" {
  bucket   = aws_s3_bucket.image.id
  provider = cloudflarer2

  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "image" {
  bucket   = aws_s3_bucket.image.id
  provider = cloudflarer2

  cors_rule {
    allowed_headers = [
      "Content-Type",
    ]
    allowed_methods = [
      "GET",
      "PUT",
    ]
    allowed_origins = local.image_cors_configuration_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 86400
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "image" {
  bucket   = aws_s3_bucket.image.id
  provider = cloudflarer2

  rule {
    id     = "Default Multipart Abort Rule"
    status = "Enabled"
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "image" {
  bucket   = aws_s3_bucket.image.id
  provider = cloudflarer2

  rule {
    bucket_key_enabled = true

    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "cloudflare_r2_bucket" "this" {
  account_id = "7e81a11f6d60d2ecf56d243bd0d77a37"
  location   = "EEUR"
  name       = "yourspot-dev"
}
