import {Product} from "../product/Product"
import {SpecialOfferType} from "./SpecialOfferType"
import {TempSpecialOfferInterface} from "./TempSpecialOfferInterface";
import {ShoppingCart} from "../cart/ShoppingCart";
import {SupermarketCatalog} from "../SupermarketCatalog";
import {Discount} from "../Discount";
import {ProductUnit} from "../product/ProductUnit";

export class Offer implements TempSpecialOfferInterface {

    public constructor(public readonly offerType: SpecialOfferType,
                       public readonly product: Product,
                       public readonly argument: number) {
    }

    applies(cart: ShoppingCart): boolean {
        return false;
    }

    getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        return new Discount(new Product('', ProductUnit.Each), '', 0.0);
    }
}
