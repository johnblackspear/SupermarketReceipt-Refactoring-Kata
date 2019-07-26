import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";
import OfferInterface from "./OfferInterface";
import {Product} from "../product/Product";

export default class BundlePercentageDiscount implements OfferInterface {

    public constructor(public readonly products: Product[],
                       public readonly discountPercentage: number) {
    }


    public applies(cart: ShoppingCart): boolean {
        return true;// cart.itemQuantity(this.product) >= 3;
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {

        return new Discount(this.products[0], "dummy", 0);
    }
}
