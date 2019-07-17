import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import {ProductAndQuantityTuple} from "./ProductAndQuantityTuple"
import {Discount} from "./Discount"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductAndQuantityTuple }
export type ProductNameToSpecialOfferMap = { [productName: string]: Offer };

export class ShoppingCart {

    cartContent: ProductQuantities = {};

    public addItemQuantity(product: Product, quantity: number): void {
        this.cartContent[product.name] = new ProductAndQuantityTuple(product, quantity);
    }

    addDiscountsToReceipt(receipt: Receipt, offers: ProductNameToSpecialOfferMap, catalog: SupermarketCatalog): void {
        for (const productName in this.cartContent) {
            const productAndQuantityTuple = this.cartContent[productName];
            const productSpecificOffer: Offer = offers[productName];

            if (productSpecificOffer) {

                const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
                let discount: Discount | null = null;

                discount = this.twoForAmount(productSpecificOffer, productAndQuantityTuple, unitPrice, discount);
                discount = this.threeForTwo(productSpecificOffer, productAndQuantityTuple, unitPrice, discount);
                discount = this.percentageDiscount(productSpecificOffer, productAndQuantityTuple, unitPrice, discount);
                discount = this.fiveForAmount(productSpecificOffer, productAndQuantityTuple, unitPrice, discount);

                if (discount != null) {
                    receipt.addDiscount(discount);
                }
            }

        }
    }

    private twoForAmount(productOffer: Offer, productAndQuantityTuple: ProductAndQuantityTuple, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.TwoForAmount && productAndQuantityTuple.quantity >= 2) {
            const x: number = 2;
            const total = productOffer.argument * Math.floor(productAndQuantityTuple.quantity / x) + productAndQuantityTuple.quantity % 2 * unitPrice;
            const discountN = unitPrice * productAndQuantityTuple.quantity - total;
            discount = new Discount(productAndQuantityTuple.product, "2 for " + productOffer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(productOffer: Offer, productAndQuantityTuple: ProductAndQuantityTuple, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.FiveForAmount && productAndQuantityTuple.quantity >= 5) {
            const x: number = 5;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountTotal = unitPrice * productAndQuantityTuple.quantity - (productOffer.argument * numberOfXs + productAndQuantityTuple.quantity % 5 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, x + " for " + productOffer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(productOffer: Offer, productAndQuantityTuple: ProductAndQuantityTuple, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(productAndQuantityTuple.product, productOffer.argument + "% off", productAndQuantityTuple.quantity * unitPrice * productOffer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(productOffer: Offer, productAndQuantityTuple: ProductAndQuantityTuple, unitPrice: number, discount: Discount | null) {
        if (productOffer.offerType == SpecialOfferType.ThreeForTwo && productAndQuantityTuple.quantity > 2) {
            const x: number = 3;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountAmount = productAndQuantityTuple.quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + productAndQuantityTuple.quantity % 3 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
