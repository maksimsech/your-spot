resource "vercel_project" "this" {
  name      = "your-spot"
  framework = "nextjs"

  root_directory  = "apps/web"
  ignore_command  = "exit 0"
  install_command = " "

  serverless_function_region = "fra1"

  vercel_authentication = {
    deployment_type = "standard_protection"
  }
}

resource "vercel_project_domain" "this" {
  project_id = vercel_project.this.id

  for_each = { for domain in var.vercel_project_domains : domain => domain }
  domain   = each.key
}

