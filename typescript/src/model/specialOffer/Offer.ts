import {Product} from "../product/Product"
import {ShoppingCart} from "../cart/ShoppingCart";
import {SupermarketCatalog} from "../SupermarketCatalog";
import {Discount} from "../Discount";

export abstract class Offer {

    public constructor(public readonly product: Product,
                       public readonly argument: number) {
    }

    public abstract applies(cart: ShoppingCart): boolean;

    public abstract getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount ;
}
