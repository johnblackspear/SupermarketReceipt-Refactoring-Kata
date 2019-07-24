import {Offer} from "./Offer";
import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";

export default class PercentageOff extends Offer {

    public applies(cart: ShoppingCart): boolean {
        return cart.getCountOfProduct(this.product) > 0;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        return new Discount(
            this.product,
            this.argument + "% off",
            cart.getCountOfProduct(this.product) * catalog.getUnitPrice(this.product) * this.argument / 100.0
        );
    }

}
