import {SupermarketCatalog} from "./SupermarketCatalog"
import {ShoppingCart} from "./cart/ShoppingCart"
import {Receipt} from "./receipt/Receipt"
import {Offer} from "./specialOffer/Offer"

export class Teller {

    private offers: Offer[] = [];

    public constructor(private readonly catalog: SupermarketCatalog) {
    }

    public addSpecialOffer(offer: Offer): void {
        this.offers.push(offer);
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
        Teller.addDiscountsToReceipt(theCart, receipt, this.offers, this.catalog);

        return receipt;
    }

    private static addDiscountsToReceipt(cart: ShoppingCart, receipt: Receipt, specialOffers: Offer[], catalog: SupermarketCatalog): void {

        for (const offer of specialOffers) {
            if (offer.applies(cart)) {
                receipt.addDiscount(offer.getDiscount(cart, catalog));
            }
        }
    }

}
