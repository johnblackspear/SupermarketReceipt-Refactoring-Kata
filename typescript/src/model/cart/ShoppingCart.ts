import {Product} from "../product/Product"
import {ProductAndQuantityTuple} from "../product/ProductAndQuantityTuple"

export class ShoppingCart {

    cartContent: ProductAndQuantityTuple[] = [];

    public addItemQuantity(product: Product, quantity: number): void {
        this.cartContent.push(new ProductAndQuantityTuple(product, quantity));
    }

    public itemQuantity(item: Product): number {
        const productAndQuantity = this.cartContent.find(pAndQ => pAndQ.product === item);
        if (!productAndQuantity) {
            return 0;
        }
        return productAndQuantity.quantity;
    }

    public content(): ProductAndQuantityTuple[] {
        return this.cartContent;
    }
}
