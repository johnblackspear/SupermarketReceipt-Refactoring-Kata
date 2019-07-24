import {SupermarketCatalog} from "./SupermarketCatalog"
import {ShoppingCart} from "./ShoppingCart"
import {Product} from "./Product"
import {Receipt} from "./Receipt"
import {Offer} from "./specialOffer/Offer"
import {SpecialOfferType} from "./specialOffer/SpecialOfferType"

export class Teller {

    private offers: Offer[] = [];

    public constructor(private readonly catalog: SupermarketCatalog) {
    }

    public addSpecialOffer(offerType: SpecialOfferType, product: Product, argument: number): void {
        this.offers.push(new Offer(offerType, product, argument));
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
