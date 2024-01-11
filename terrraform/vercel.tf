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
