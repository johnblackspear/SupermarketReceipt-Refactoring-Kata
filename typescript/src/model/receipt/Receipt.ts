import {Discount} from "../Discount"
import {ReceiptItem} from "./ReceiptItem"
import {ProductAndQuantityTuple} from "../product/ProductAndQuantityTuple";
import {SupermarketCatalog} from "../SupermarketCatalog";

export class Receipt {
    private items: ReceiptItem[] = [];
    private discounts: Discount[] = [];

    public getTotalPrice(): number {
        const amounts = this.items.map(item => item.totalPrice)
            .concat(this.discounts.map(discount => -discount.discountAmount));

        return amounts.reduce((total, amount) => total + amount, 0);
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
