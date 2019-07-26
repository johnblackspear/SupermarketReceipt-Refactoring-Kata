import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";
import {Product} from "../product/Product";
import OfferInterface from "./OfferInterface";

export default class ThreeForTwo implements OfferInterface {

    public constructor(public readonly product: Product) {
    }

    public applies(cart: ShoppingCart): boolean {
        return cart.itemQuantity(this.product) >= 3;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        const unitPrice: number = catalog.getUnitPrice(this.product);
        const x: number = 3;
        const numberOfXs = Math.floor(cart.itemQuantity(this.product) / x);
        const discountAmount = cart.itemQuantity(this.product) * unitPrice - ((numberOfXs * 2 * unitPrice) + cart.itemQuantity(this.product) % 3 * unitPrice);
        return new Discount(this.product, "3 for 2", discountAmount);
    }

}
