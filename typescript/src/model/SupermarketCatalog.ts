import {Product} from "./product/Product"

export interface SupermarketCatalog {
    addProduct(product: Product , price: number): void;

    getUnitPrice(product: Product): number;

}
