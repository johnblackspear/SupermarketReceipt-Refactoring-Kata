import {Product} from "../product/Product"
import {ProductAndQuantityTuple} from "../product/ProductAndQuantityTuple"

type ProductQuantities = { [productName: string]: ProductAndQuantityTuple }

export class ShoppingCart {

    cartContent: ProductQuantities = {};

    public addItemQuantity(product: Product, quantity: number): void {
        this.cartContent[product.name] = new ProductAndQuantityTuple(product, quantity);
    }

    public itemQuantity(item: Product): number {
        if (!this.cartContent[item.name]) {
            return 0;
        }
        return this.cartContent[item.name].quantity;
    }
}
