import env from 'env-var'

export const envApp = Object.freeze({
    name: 'orders-api',
    host: env.get('HOST').asString() as string,
    port: env.get('PORT').asInt() as number,
    environment: env.get('ENVIRONMENT').asEnum(['development', 'production'])
})