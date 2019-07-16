import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import * as _ from "lodash"
import {ProductQuantity} from "./ProductQuantity"
import {Discount} from "./Discount"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductQuantity }
export type OffersByProduct = { [productName: string]: Offer };

export class ShoppingCart {

    private readonly items: ProductQuantity[] = [];
    stock: ProductQuantities = {};


    getItems(): ProductQuantity[] {
        return _.clone(this.items);
    }

    productQuantities(): ProductQuantities {
        return this.stock;
    }


    public addItemQuantity(product: Product, quantity: number): void {
        let productQuantity = new ProductQuantity(product, quantity);
        this.items.push(productQuantity);
        this.stock[product.name] = productQuantity;
    }

    handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog): void {
        for (const productName in this.productQuantities()) {
            const productQuantity = this.stock[productName]
            const product = productQuantity.product;
            const quantity: number = this.stock[productName].quantity;
            if (offers[productName]) {
                const offer: Offer = offers[productName];
                const unitPrice: number = catalog.getUnitPrice(product);
                let quantityAsInt = quantity;
                let discount: Discount | null = null;
                let x = 1;
                if (offer.offerType == SpecialOfferType.ThreeForTwo) {
                    x = 3;

                } else if (offer.offerType == SpecialOfferType.TwoForAmount) {
                    x = 2;
                    if (quantityAsInt >= 2) {
                        const total = offer.argument * Math.floor(quantityAsInt / x) + quantityAsInt % 2 * unitPrice;
                        const discountN = unitPrice * quantity - total;
                        discount = new Discount(product, "2 for " + offer.argument, discountN);
                    }

                }
                if (offer.offerType == SpecialOfferType.FiveForAmount) {
                    x = 5;
                }
                const numberOfXs = Math.floor(quantityAsInt / x);
                if (offer.offerType == SpecialOfferType.ThreeForTwo && quantityAsInt > 2) {
                    const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantityAsInt % 3 * unitPrice);
                    discount = new Discount(product, "3 for 2", discountAmount);
                }
                if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
                    discount = new Discount(product, offer.argument + "% off", quantity * unitPrice * offer.argument / 100.0);
                }
                if (offer.offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
                    const discountTotal = unitPrice * quantity - (offer.argument * numberOfXs + quantityAsInt % 5 * unitPrice);
                    discount = new Discount(product, x + " for " + offer.argument, discountTotal);
                }
                if (discount != null)
                    receipt.addDiscount(discount);
            }

        }
    }
}
