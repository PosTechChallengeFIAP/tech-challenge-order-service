import { injectable } from "tsyringe";
import { TPoc, TProduct, TStock } from "./TInventoryServiceAdapter";
import { IInventoryServiceAdapter } from "./IInventoryServiceAdapter";
import axios, { AxiosInstance } from "axios";
import { envAPIs } from "@config/variables/apis";

@injectable()
export class InventoryServiceAdapter implements IInventoryServiceAdapter {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: envAPIs.inventoryURL,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })

        this.axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if(error.response?.status) {
                    return Promise.resolve({ data: error.response?.data, status: error.response.status });
                }
                return Promise.reject(error);
            }
        );
    }

    async getPocById(id: number): Promise<TPoc | null> {
        const response = await this.axiosInstance.get<TPoc>("/pocs", {
            params: {
                id,
            }
        });

        if (response.status !== 200) {
            return null;
        }

        const poc = response.data;

        return poc;
    }

    async getByPocAndProductId(pocId: number, productId: number): Promise<TStock | null> {
        const response = await this.axiosInstance.get<TStock>(`/pocs/${pocId}/stocks`, {
            params: {
                productId,
            }
        });

        if (response.status !== 200) {
            return null;
        }

        const stock = response.data;

        return stock;
    }
}