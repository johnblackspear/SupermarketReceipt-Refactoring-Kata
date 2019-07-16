import {Product} from "./Product"

export class ProductAndQuantityTuple {

    constructor(public readonly product: Product,
                public readonly quantity: number) {
        this.product = product;
        this.quantity = quantity;
    }
}
