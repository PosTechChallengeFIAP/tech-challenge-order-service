export enum EPocCategory {
    RESTAURANT = 'RESTAURANT',
    BAR = 'BAR',
    CAFE = 'CAFE',
    NIGHTCLUB = 'NIGHTCLUB',
}

export type TPoc = {
    id: string
    name: string
    description: string
    category: EPocCategory
    createdAt: Date
    updatedAt: Date
}

export enum EProductCategory {
    FOOD = 'FOOD',
    DRINK = 'DRINK',
}

export type TStock = {
    id: number;
    poc: TPoc;
    product: TProduct;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TProduct = {
    id: number;
    name: string;
    description: string;
    category: EProductCategory;
    createdAt: Date;
    updatedAt: Date;
}