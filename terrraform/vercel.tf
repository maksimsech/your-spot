resource "vercel_project" "this" {
  name      = "your-spot"
  framework = "nextjs"

  root_directory  = "src/apps/web"
  ignore_command  = "exit 0"
  install_command = "cd ../.. && npm ci"

  vercel_authentication = {
    deployment_type = "standard_protection"
  }
}

resource "vercel_project_domain" "dev" {
  project_id = vercel_project.this.id
  domain     = "your-spot-dev.vercel.app"
}

resource "vercel_project_domain" "prod" {
  project_id = vercel_project.this.id
  domain     = "your-spot.vercel.app"
}
