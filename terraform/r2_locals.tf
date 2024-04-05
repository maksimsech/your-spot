locals {
  image_cors_configuration_origins = setunion(
    values({ for domain in var.vercel_project_domains : domain => "https://${domain}" }),
    var.cloudflare_image_cors_sites
  )
}
