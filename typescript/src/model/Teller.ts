import {SupermarketCatalog} from "./SupermarketCatalog"
import {ProductNameToSpecialOfferMap, ShoppingCart} from "./ShoppingCart"
import {Product} from "./Product"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

export class Teller {

    private offers: ProductNameToSpecialOfferMap = {};

    public constructor(private readonly catalog: SupermarketCatalog) {
    }

    public addSpecialOffer(offerType: SpecialOfferType, product: Product, argument: number): void {
        this.offers[product.name] = new Offer(offerType, product, argument);
    }

    public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
        const receipt = new Receipt();
        const productQuantities = theCart.cartContent;
        for (let productName in productQuantities) {
            let p = productQuantities[productName].product;
            let quantity = productQuantities[productName].quantity;

            let unitPrice = this.catalog.getUnitPrice(p);
            let price = quantity * unitPrice;
            receipt.addProduct(p, quantity, unitPrice, price);
        }
        theCart.addDiscountsToReceipt(receipt, this.offers, this.catalog);

        return receipt;
    }

}
