import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import {ProductAndQuantityTuple} from "./ProductAndQuantityTuple"
import {Discount} from "./Discount"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductAndQuantityTuple }

export class ShoppingCart {

    cartContent: ProductQuantities = {};

    public addItemQuantity(product: Product, quantity: number): void {
        this.cartContent[product.name] = new ProductAndQuantityTuple(product, quantity);
    }

    addDiscountsToReceipt(receipt: Receipt, specialOffers: Offer[], catalog: SupermarketCatalog): void {

        for (let offer of specialOffers) {
            let discount: Discount | null = null;

            discount = this.twoForAmount(offer, catalog, discount);
            discount = this.threeForTwo(offer, catalog, discount);
            discount = this.percentageDiscount(offer, catalog, discount);
            discount = this.fiveForAmount(offer, catalog, discount);

            if (discount != null) {
                receipt.addDiscount(discount);
            }
        }
    }

    private twoForAmount(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {

        const productAndQuantityTuple = this.cartContent[offer.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);

        if (offer.offerType == SpecialOfferType.TwoForAmount && productAndQuantityTuple.quantity >= 2) {
            const x: number = 2;
            const total = offer.argument * Math.floor(productAndQuantityTuple.quantity / x) + productAndQuantityTuple.quantity % 2 * unitPrice;
            const discountN = unitPrice * productAndQuantityTuple.quantity - total;
            discount = new Discount(productAndQuantityTuple.product, "2 for " + offer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[offer.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (offer.offerType == SpecialOfferType.FiveForAmount && productAndQuantityTuple.quantity >= 5) {
            const x: number = 5;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountTotal = unitPrice * productAndQuantityTuple.quantity - (offer.argument * numberOfXs + productAndQuantityTuple.quantity % 5 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, x + " for " + offer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[offer.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (offer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(productAndQuantityTuple.product, offer.argument + "% off", productAndQuantityTuple.quantity * unitPrice * offer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[offer.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (offer.offerType == SpecialOfferType.ThreeForTwo && productAndQuantityTuple.quantity > 2) {
            const x: number = 3;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountAmount = productAndQuantityTuple.quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + productAndQuantityTuple.quantity % 3 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
