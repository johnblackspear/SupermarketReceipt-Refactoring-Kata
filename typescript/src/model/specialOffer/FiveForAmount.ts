import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";
import {Product} from "../product/Product";
import OfferInterface from "./OfferInterface";

export default class FiveForAmount implements OfferInterface {

    public constructor(public readonly product: Product,
                       public readonly discountedPrice: number) {
    }

    public applies(cart: ShoppingCart): boolean {
        return cart.itemQuantity(this.product) >= 5;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        const unitPrice: number = catalog.getUnitPrice(this.product);
        const x: number = 5;
        const numberOfXs = Math.floor(cart.itemQuantity(this.product) / x);
        const discountTotal = unitPrice * cart.itemQuantity(this.product) - (this.discountedPrice * numberOfXs + cart.itemQuantity(this.product) % 5 * unitPrice);
        return new Discount(this.product, x + " for " + this.discountedPrice, discountTotal);
    }

}
