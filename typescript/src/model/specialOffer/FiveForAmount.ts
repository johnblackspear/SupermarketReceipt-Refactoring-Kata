import {Offer} from "./Offer";
import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";

export default class FiveForAmount extends Offer {

    public applies(cart: ShoppingCart): boolean {
        return cart.getCountOfProduct(this.product) >= 5;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        const unitPrice: number = catalog.getUnitPrice(this.product);
        const x: number = 5;
        const numberOfXs = Math.floor(cart.getCountOfProduct(this.product) / x);
        const discountTotal = unitPrice * cart.getCountOfProduct(this.product) - (this.argument * numberOfXs + cart.getCountOfProduct(this.product) % 5 * unitPrice);
        return new Discount(this.product, x + " for " + this.argument, discountTotal);
    }

}
