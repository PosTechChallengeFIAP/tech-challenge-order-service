import { envAPIs } from "./apis"
import { envApp } from "./app"
import { envPostgres } from "./postgres"
import { envSQS } from "./sqs"

describe('Environment variables loading', () => {
    it('should load envSQS correctly', () => {
        expect(envSQS).toEqual({
        region: 'us-west-2',
        accessKeyId: 'AKIA_FAKE_ACCESS_KEY',
        secretAccessKey: 'FAKE_SECRET_KEY',
        awsSessionToken: 'FAKE_SESSION_TOKEN',
        orderQueue: 'https://fake-sqs-url',
        })
    })

    it('should load envPostgres correctly', () => {
        expect(envPostgres).toEqual({
            host: 'localhost',
            port: 5432,
            user: 'postgres_user',
            pass: 'postgres_pass',
            database: 'mydb',
            schema: 'public',
        })
    })

    it('should load envApp correctly', () => {
        expect(envApp).toEqual({
        name: 'my-app',
        host: '0.0.0.0',
        port: 3000,
        environment: 'development',
        })
    })

    it('should load envAPIs correctly', () => {
        expect(envAPIs).toEqual({
        inventoryURL: 'https://inventory.example.com/',
        })
    })
})
