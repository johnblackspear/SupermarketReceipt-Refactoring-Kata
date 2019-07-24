import {Product} from "./product/Product"

export class Discount {

    constructor(public readonly product: Product,
                public readonly description: string,
                public readonly discountAmount: number) {
    }
}
