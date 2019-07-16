import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import * as _ from "lodash"
import {ProductQuantity} from "./ProductQuantity"
import {Discount} from "./Discount"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductQuantity }
export type ProductNameToSpecialOfferMap = { [productName: string]: Offer };

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

    handleOffers(receipt: Receipt, offers: ProductNameToSpecialOfferMap, catalog: SupermarketCatalog): void {
        for (const productName in this.productQuantities()) {
            const product = this.stock[productName].product;
            const quantity: number = this.getProductQuantity(productName);
            const productSpecificOffer: Offer = offers[productName];

            if (productSpecificOffer) {

                const unitPrice: number = catalog.getUnitPrice(product);
                let discount: Discount | null = null;

                discount = this.twoForAmount(productSpecificOffer, product, quantity, unitPrice, discount);
                discount = this.threeForTwo(productSpecificOffer, product, quantity, unitPrice, discount);
                discount = this.percentageDiscount(productSpecificOffer, product, quantity, unitPrice, discount);
                discount = this.fiveForAmount(productSpecificOffer, product, quantity, unitPrice, discount);

                if (discount != null) {
                    receipt.addDiscount(discount);
                }
            }

        }
    }

    private getProductQuantity(productName: string) {
        return this.stock[productName].quantity;
    }

    private twoForAmount(productOffer: Offer, product: Product, quantity: number, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.TwoForAmount && quantity >= 2) {
            const x: number = 2;
            const total = productOffer.argument * Math.floor(quantity / x) + quantity % 2 * unitPrice;
            const discountN = unitPrice * quantity - total;
            discount = new Discount(product, "2 for " + productOffer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(productOffer: Offer, product: Product, quantity: number, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.FiveForAmount && quantity >= 5) {
            const x: number = 5;
            const numberOfXs = Math.floor(quantity / x);
            const discountTotal = unitPrice * quantity - (productOffer.argument * numberOfXs + quantity % 5 * unitPrice);
            discount = new Discount(product, x + " for " + productOffer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(productOffer: Offer, product: Product, quantity: number, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(product, productOffer.argument + "% off", quantity * unitPrice * productOffer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(productOffer: Offer, product: Product, quantity: number, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.ThreeForTwo && quantity > 2) {
            const x: number = 3;
            const numberOfXs = Math.floor(quantity / x);
            const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantity % 3 * unitPrice);
            discount = new Discount(product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
