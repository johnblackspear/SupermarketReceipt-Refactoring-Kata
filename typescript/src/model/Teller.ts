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

    public getReceipt(cart: ShoppingCart): Receipt {
        let receipt = new Receipt();
        receipt = Teller.addProductsToReceipt(cart, receipt, this.catalog);
        receipt = Teller.addDiscountsToReceipt(cart, receipt, this.offers, this.catalog);

        return receipt;
    }

    private static addProductsToReceipt(cart: ShoppingCart, receipt: Receipt, catalog: SupermarketCatalog): Receipt {
        cart.content().forEach(productAndQuantity => receipt.addProduct(productAndQuantity, catalog));
        return receipt;
    }

    private static addDiscountsToReceipt(
        cart: ShoppingCart,
        receipt: Receipt,
        specialOffers: Offer[],
        catalog: SupermarketCatalog): Receipt {

        specialOffers
            .filter(offer => offer.applies(cart))
            .forEach(offer => receipt.addDiscount(offer.getDiscount(cart, catalog)));
        return receipt;
    }

}
