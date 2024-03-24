terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "1.0.0"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "1.14.0"
    }
  }
}

provider "mongodbatlas" {
  public_key  = var.mongodbatlas_public_key
  private_key = var.mongodbatlas_private_key
}

variable "mongodbatlas_public_key" {
  type        = string
  nullable    = false
  description = "MongoDB Atlas public key"
}

variable "mongodbatlas_private_key" {
  type        = string
  nullable    = false
  description = "MongoDB Atlas private key"
}

provider "vercel" {
  api_token = var.vercel_api_key
}

variable "vercel_api_key" {
  type        = string
  nullable    = false
  description = "Vercel api key"
}
