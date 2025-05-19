data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "tech-challenge-tf-state-bucket-d41d8"
    key    = "network/terraform.tfstate"
    region = "us-west-2"
  }
}