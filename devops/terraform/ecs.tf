resource "aws_ecs_cluster" "ecs_cluster" {
  name = "tc-order-service"
}

resource "aws_ecs_service" "app_service" {
  name                    = "tc-order-service"
  cluster                 = aws_ecs_cluster.ecs_cluster.id
  task_definition         = aws_ecs_task_definition.app_task.arn
  desired_count           = 2
  launch_type             = "EC2"
  force_new_deployment    = true

  network_configuration {
    subnets          = [aws_subnet.private.id]
    security_groups  = [data.terraform_remote_state.network.outputs.main_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_target_group.arn
    container_name   = "tc-order-service"
    container_port   = 3000
  }

  deployment_controller {
    type = "ECS"
  }

  depends_on = [aws_db_instance.postgres, aws_instance.ecs_instance]
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "tc-order-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]

  container_definitions = jsonencode([
    {
      name      = "tc-order-service"
      image     = "loadinggreg/tech-challenge-order-service:${var.tc_image_tag}"
      cpu       = 256
      memory    = 512
      essential = true

      healthCheck = {
        command = ["CMD-SHELL", "curl -f http://localhost:3000/orders-api/health/liveness || exit 1"]
        interval = 30
        retries  = 5
        start_period = 60
        timeout = 5
      }

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/tc-order-service"
          "awslogs-region"        = "us-west-2"
          "awslogs-stream-prefix" = "app-ecs"
        }
      }
      
      environment = [
        {
          name  = "POSTGRES_HOST"
          value = aws_db_instance.postgres.address
        },
        {
          name  = "POSTGRES_PORT"
          value = "5432"
        },
        {
          name  = "POSTGRES_USER"
          value = var.db_username
        },
        {
          name  = "POSTGRES_PASS"
          value = var.db_password
        },
        {
          name  = "POSTGRES_DB"
          value = "TechChallengeOrders"
        },
        {
          name  = "POSTGRES_SCHEMA"
          value = "order-schema"
        },
        {
          name  = "APP_NAME"
          value = "orders-api"
        },
        {
          name  = "AWS_ACCESS_KEY_ID"
          value = var.aws_access_key_id
        },
        {
          name  = "AWS_SECRET_ACCESS_KEY"
          value = var.aws_secret_access_key
        },
        {
          name  = "AWS_SESSION_TOKEN"
          value = var.aws_session_token
        },
        {
          name  = "ENVIRONMENT"
          value = "production"
        },
        {
          name = "HOST"
          value = "0.0.0.0"
        },
        {
          name = "INVENTORY_URL"
          value = "${data.terraform_remote_state.inventory-service.outputs.inventory_service_api_url}/inventory-api"
        }
      ]
    }
  ])
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/tc-order-service"
}