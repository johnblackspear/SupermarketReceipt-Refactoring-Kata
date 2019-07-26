import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";
import {Product} from "../product/Product";
import OfferInterface from "./OfferInterface";

export default class PercentageOff implements OfferInterface {

    public constructor(public readonly product: Product,
                       public readonly discountPercentage: number) {
    }

    public applies(cart: ShoppingCart): boolean {
        return cart.itemQuantity(this.product) > 0;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        return new Discount(
            this.product,
            this.discountPercentage + "% off",
            cart.itemQuantity(this.product) * catalog.getUnitPrice(this.product) * this.discountPercentage / 100.0
        );
    }

}
