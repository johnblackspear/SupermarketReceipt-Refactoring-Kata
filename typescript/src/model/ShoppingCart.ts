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
            const productQuantity = this.stock[productName];
            const product = productQuantity.product;
            const quantity: number = this.stock[productName].quantity;
            if (offers[productName]) {
                const offer: Offer = offers[productName];
                const unitPrice: number = catalog.getUnitPrice(product);
                let discount: Discount | null = null;
                let x = 1;
                if (offer.offerType == SpecialOfferType.ThreeForTwo) {
                    x = 3;

                }
                if (offer.offerType == SpecialOfferType.TwoForAmount) {
                    x = 2;

                }
                if (offer.offerType == SpecialOfferType.FiveForAmount) {
                    x = 5;
                }
                const numberOfXs = Math.floor(quantity / x);
                discount = this.twoForAmount(quantity, offer, x, unitPrice, discount, product);
                discount = this.threeForTwo(offer, quantity, unitPrice, numberOfXs, discount, product);
                discount = this.percentageDiscount(offer, discount, product, quantity, unitPrice);
                discount = this.fiveForAmount(offer, quantity, unitPrice, numberOfXs, discount, product, x);
                if (discount != null)
                    receipt.addDiscount(discount);
            }

        }
    }

    private twoForAmount(quantity: number, offer: Offer, x: number, unitPrice: number, discount: Discount | null, product: Product) {
        if (quantity >= 2) {
            const total = offer.argument * Math.floor(quantity / x) + quantity % 2 * unitPrice;
            const discountN = unitPrice * quantity - total;
            discount = new Discount(product, "2 for " + offer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(offer: Offer, quantity: number, unitPrice: number, numberOfXs: number, discount: Discount | null, product: Product, x: number) {
        if (offer.offerType == SpecialOfferType.FiveForAmount && quantity >= 5) {
            const discountTotal = unitPrice * quantity - (offer.argument * numberOfXs + quantity % 5 * unitPrice);
            discount = new Discount(product, x + " for " + offer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(offer: Offer, discount: Discount | null, product: Product, quantity: number, unitPrice: number) {
        if (offer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(product, offer.argument + "% off", quantity * unitPrice * offer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(offer: Offer, quantity: number, unitPrice: number, numberOfXs: number, discount: Discount | null, product: Product) {
        if (offer.offerType == SpecialOfferType.ThreeForTwo && quantity > 2) {
            const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantity % 3 * unitPrice);
            discount = new Discount(product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
