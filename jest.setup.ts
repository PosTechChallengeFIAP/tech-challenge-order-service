import 'reflect-metadata';

process.env.AWS_ACCESS_KEY_ID = 'AKIA_FAKE_ACCESS_KEY'
process.env.AWS_SECRET_ACCESS_KEY = 'FAKE_SECRET_KEY'
process.env.AWS_SESSION_TOKEN = 'FAKE_SESSION_TOKEN'
process.env.ORDER_QUEUE_URL = 'https://fake-sqs-url'

process.env.POSTGRES_HOST = 'localhost'
process.env.POSTGRES_PORT = '5432'
process.env.POSTGRES_USER = 'postgres_user'
process.env.POSTGRES_PASS = 'postgres_pass'
process.env.POSTGRES_DB = 'mydb'
process.env.POSTGRES_SCHEMA = 'public'

process.env.APP_NAME = 'my-app'
process.env.HOST = '0.0.0.0'
process.env.PORT = '3000'
process.env.ENVIRONMENT = 'development'

process.env.INVENTORY_URL = 'https://inventory.example.com'
