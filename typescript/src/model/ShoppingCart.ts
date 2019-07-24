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

    public getCountOfProduct(product: Product): number {
        return this.cartContent[product.name].quantity;
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

        const unitPrice: number = catalog.getUnitPrice(offer.product);

        if (offer.offerType == SpecialOfferType.TwoForAmount && this.getCountOfProduct(offer.product) >= 2) {
            const x: number = 2;
            const total = offer.argument * Math.floor(this.getCountOfProduct(offer.product) / x) + this.getCountOfProduct(offer.product) % 2 * unitPrice;
            const discountN = unitPrice * this.getCountOfProduct(offer.product) - total;
            discount = new Discount(offer.product, "2 for " + offer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {

        const unitPrice: number = catalog.getUnitPrice(offer.product);
        if (offer.offerType == SpecialOfferType.FiveForAmount && this.getCountOfProduct(offer.product) >= 5) {
            const x: number = 5;
            const numberOfXs = Math.floor(this.getCountOfProduct(offer.product) / x);
            const discountTotal = unitPrice * this.getCountOfProduct(offer.product) - (offer.argument * numberOfXs + this.getCountOfProduct(offer.product) % 5 * unitPrice);
            discount = new Discount(offer.product, x + " for " + offer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {
        const unitPrice: number = catalog.getUnitPrice(offer.product);
        if (offer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(offer.product, offer.argument + "% off", this.getCountOfProduct(offer.product) * unitPrice * offer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(offer: Offer, catalog: SupermarketCatalog, discount: Discount | null) {
        const unitPrice: number = catalog.getUnitPrice(offer.product);
        if (offer.offerType == SpecialOfferType.ThreeForTwo && this.getCountOfProduct(offer.product) > 2) {
            const x: number = 3;
            const numberOfXs = Math.floor(this.getCountOfProduct(offer.product) / x);
            const discountAmount = this.getCountOfProduct(offer.product) * unitPrice - ((numberOfXs * 2 * unitPrice) + this.getCountOfProduct(offer.product) % 3 * unitPrice);
            discount = new Discount(offer.product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
