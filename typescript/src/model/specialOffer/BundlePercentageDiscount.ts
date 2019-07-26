import {ShoppingCart} from "../cart/ShoppingCart";
import {Discount} from "../Discount";
import {SupermarketCatalog} from "../SupermarketCatalog";
import OfferInterface from "./OfferInterface";
import {Product} from "../product/Product";

export default class BundlePercentageDiscount implements OfferInterface {

    public constructor(public readonly bundledProducts: Product[],
                       public readonly description: string,
                       public readonly discountPercentage: number) {
    }


    public applies(cart: ShoppingCart): boolean {
        return this.bundledProducts.every(product => {
            return cart.itemQuantity(product) >= 1;
        });
    }

    public getDiscount(cart: ShoppingCart, catalog: SupermarketCatalog): Discount {
        const totalPriceForBundle = this.bundledProducts.map(product => catalog.getUnitPrice(product))
            .reduce((totalPriceForBundle, itemPrice) => totalPriceForBundle + itemPrice, 0);
        const discountedPrice = totalPriceForBundle * (1 - (this.discountPercentage / 100));

        return new Discount(this.bundledProducts[0], this.description, totalPriceForBundle - discountedPrice);
    }
}
