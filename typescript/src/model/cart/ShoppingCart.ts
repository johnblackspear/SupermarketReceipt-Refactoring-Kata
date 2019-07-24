import {Product} from "../product/Product"
import {SupermarketCatalog} from "../SupermarketCatalog"
import {ProductAndQuantityTuple} from "../product/ProductAndQuantityTuple"
import {Receipt} from "../receipt/Receipt"
import {Offer} from "../specialOffer/Offer"

type ProductQuantities = { [productName: string]: ProductAndQuantityTuple }

export class ShoppingCart {

    cartContent: ProductQuantities = {};

    public addItemQuantity(product: Product, quantity: number): void {
        this.cartContent[product.name] = new ProductAndQuantityTuple(product, quantity);
    }

    public getCountOfProduct(product: Product): number {
        if (!this.cartContent[product.name]) {
            return 0;
        }
        return this.cartContent[product.name].quantity;
    }

    addDiscountsToReceipt(receipt: Receipt, specialOffers: Offer[], catalog: SupermarketCatalog): void {

        for (const offer of specialOffers) {
            if (offer.applies(this)) {
                receipt.addDiscount(offer.getDiscount(this, catalog));
            }
        }
    }
}
