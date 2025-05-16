import { TPoc, TStock } from "./TInventoryServiceAdapter";

export interface IInventoryServiceAdapter {
    getPocById(id: number): Promise<TPoc | null>
    getByPocAndProductId(pocId: number, productId: number): Promise<TStock | null>
}