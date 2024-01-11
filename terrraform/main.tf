terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "1.0.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_key
}

variable "vercel_api_key" {
  nullable    = false
  description = "Vercel api key"
}
