variable "cloudflare_image_cors_sites" {
  type        = list(string)
  default     = []
  description = "Cloudflare image bucket allowed origins"
}
