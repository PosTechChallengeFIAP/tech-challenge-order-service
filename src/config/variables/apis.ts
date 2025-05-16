import env from 'env-var'

export const envAPIs = Object.freeze({
    inventoryURL: env.get('INVENTORY_URL').asUrlString() as string,
})