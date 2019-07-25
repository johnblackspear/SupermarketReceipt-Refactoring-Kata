import {Discount} from "../Discount"
import {ReceiptItem} from "./ReceiptItem"
import {ProductAndQuantityTuple} from "../product/ProductAndQuantityTuple";
import {SupermarketCatalog} from "../SupermarketCatalog";

export class Receipt {
    private items: ReceiptItem[] = [];
    private discounts: Discount[] = [];

    public getTotalPrice(): number {
        let total = 0.0;
        for (let item of this.items) {
            total += item.totalPrice;
        }
        for (let discount of this.discounts) {
            total -= discount.discountAmount;
        }
        return total;
    }

    public addProduct(productAndQuantity: ProductAndQuantityTuple, catalog: SupermarketCatalog): void {
        const unitPrice: number = catalog.getUnitPrice(productAndQuantity.product);
        this.items.push(
            new ReceiptItem(
                productAndQuantity.product,
                productAndQuantity.quantity,
                unitPrice,
                unitPrice * productAndQuantity.quantity
            )
        );
    }

    public addDiscount(discount: Discount): void {
        this.discounts.push(discount);
    }

}
