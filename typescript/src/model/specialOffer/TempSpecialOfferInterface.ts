import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";

export interface TempSpecialOfferInterface {

    applies(cart: ShoppingCart): boolean;

    getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount;
}
