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

    addDiscountsToReceipt(receipt: Receipt, specialOffers: ProductNameToSpecialOfferMap, catalog: SupermarketCatalog): void {

        for (const specialProductName in specialOffers) {
            let discount: Discount | null = null;

            discount = this.twoForAmount(specialOffers, specialProductName, catalog, discount);
            discount = this.threeForTwo(specialOffers, specialProductName, catalog, discount);
            discount = this.percentageDiscount(specialOffers, specialProductName, catalog, discount);
            discount = this.fiveForAmount(specialOffers, specialProductName, catalog, discount);

            if (discount != null) {
                receipt.addDiscount(discount);
            }
        }
    }

    private twoForAmount(specialOfferMap: ProductNameToSpecialOfferMap, specialProductName: string, catalog: SupermarketCatalog, discount: Discount | null) {

        const productAndQuantityTuple = this.cartContent[specialProductName];
        const specificSpecialOffer: Offer = specialOfferMap[productAndQuantityTuple.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);

        if (specificSpecialOffer.offerType == SpecialOfferType.TwoForAmount && productAndQuantityTuple.quantity >= 2) {
            const x: number = 2;
            const total = specificSpecialOffer.argument * Math.floor(productAndQuantityTuple.quantity / x) + productAndQuantityTuple.quantity % 2 * unitPrice;
            const discountN = unitPrice * productAndQuantityTuple.quantity - total;
            discount = new Discount(productAndQuantityTuple.product, "2 for " + specificSpecialOffer.argument, discountN);
        }
        return discount;
    }

    private fiveForAmount(specialOfferMap: ProductNameToSpecialOfferMap, specialProductName: string, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[specialProductName];
        const specificSpecialOffer: Offer = specialOfferMap[productAndQuantityTuple.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (specificSpecialOffer.offerType == SpecialOfferType.FiveForAmount && productAndQuantityTuple.quantity >= 5) {
            const x: number = 5;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountTotal = unitPrice * productAndQuantityTuple.quantity - (specificSpecialOffer.argument * numberOfXs + productAndQuantityTuple.quantity % 5 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, x + " for " + specificSpecialOffer.argument, discountTotal);
        }
        return discount;
    }

    private percentageDiscount(specialOfferMap: ProductNameToSpecialOfferMap, specialProductName: string, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[specialProductName];
        const specificSpecialOffer: Offer = specialOfferMap[productAndQuantityTuple.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (specificSpecialOffer.offerType == SpecialOfferType.PercentageDiscount) {
            discount = new Discount(productAndQuantityTuple.product, specificSpecialOffer.argument + "% off", productAndQuantityTuple.quantity * unitPrice * specificSpecialOffer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwo(specialOfferMap: ProductNameToSpecialOfferMap, specialProductName: string, catalog: SupermarketCatalog, discount: Discount | null) {
        const productAndQuantityTuple = this.cartContent[specialProductName];
        const specificSpecialOffer: Offer = specialOfferMap[productAndQuantityTuple.product.name];
        const unitPrice: number = catalog.getUnitPrice(productAndQuantityTuple.product);
        if (specificSpecialOffer.offerType == SpecialOfferType.ThreeForTwo && productAndQuantityTuple.quantity > 2) {
            const x: number = 3;
            const numberOfXs = Math.floor(productAndQuantityTuple.quantity / x);
            const discountAmount = productAndQuantityTuple.quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + productAndQuantityTuple.quantity % 3 * unitPrice);
            discount = new Discount(productAndQuantityTuple.product, "3 for 2", discountAmount);
        }
        return discount;
    }
}
