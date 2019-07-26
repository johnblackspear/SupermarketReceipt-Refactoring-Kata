import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";

export default interface OfferInterface {
    getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount;

    applies(cart: ShoppingCart): boolean;
}
