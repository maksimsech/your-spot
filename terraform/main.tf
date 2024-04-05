terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "1.0.0"
    }

    # mongodbatlas = {
    #   source  = "mongodb/mongodbatlas"
    #   version = "1.14.0"
    # }

    cloudflarer2 = {
      source  = "hashicorp/aws"
      version = "~> 5"
    }
  }

  cloud {
    organization = "bymng"

    workspaces {
      name = "yourspot-dev"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_key
}

variable "vercel_api_key" {
  type        = string
  nullable    = false
  description = "Vercel api key"
}

# provider "mongodbatlas" {
#   public_key  = var.mongodbatlas_public_key
#   private_key = var.mongodbatlas_private_key
# }

# variable "mongodbatlas_public_key" {
#   type        = string
#   nullable    = false
#   description = "MongoDB Atlas public key"
# }

# variable "mongodbatlas_private_key" {
#   type        = string
#   nullable    = false
#   description = "MongoDB Atlas private key"
# }

provider "cloudflarer2" {
  region = "us-east-1"

  access_key = var.cloudflare_access_key
  secret_key = var.cloudflare_secret_key

  skip_credentials_validation = true
  skip_region_validation      = true
  skip_requesting_account_id  = true

  endpoints {
    s3 = var.cloudflare_endpoint_s3
  }
}

variable "cloudflare_access_key" {
  type        = string
  nullable    = false
  description = "Cloudflare R2 access key"
}

variable "cloudflare_secret_key" {
  type        = string
  nullable    = false
  description = "Cloudflare R2 secret key"
}

variable "cloudflare_endpoint_s3" {
  type        = string
  nullable    = false
  description = "Cloudflare R2 AWS S3 endpoint"
}
