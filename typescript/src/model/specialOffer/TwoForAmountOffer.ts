import {Offer} from "./Offer";
import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";

export default class TwoForAmountOffer extends Offer {

    public applies(cart: ShoppingCart): boolean {
        return cart.itemQuantity(this.product) >= 2;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        const x: number = 2;
        const unitPrice = catalog.getUnitPrice(this.product);
        const total = this.argument * Math.floor(cart.itemQuantity(this.product) / x) + cart.itemQuantity(this.product) % 2 * unitPrice;
        const discountN = unitPrice * cart.itemQuantity(this.product) - total;
        return new Discount(this.product, "2 for " + this.argument, discountN);
    }

}
