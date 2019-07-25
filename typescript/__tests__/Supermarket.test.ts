import {FakeCatalog} from "./FakeCatalog"
import {Product} from "../src/model/product/Product"
import {SupermarketCatalog} from "../src/model/SupermarketCatalog"
import {ProductUnit} from "../src/model/product/ProductUnit"
import {ShoppingCart} from "../src/model/cart/ShoppingCart";
import {Teller} from "../src/model/Teller";
import {Receipt} from "../src/model/receipt/Receipt";
import FiveForAmount from "../src/model/specialOffer/FiveForAmount";
import ThreeForTwo from "../src/model/specialOffer/ThreeForTwo";
import PercentageOff from "../src/model/specialOffer/PercentageOff";
import TwoForAmountOffer from "../src/model/specialOffer/TwoForAmountOffer";

describe('Supermarket', function () {

    const apples: Product = new Product("Apples, Kilo", ProductUnit.Kilo);
    const applePrice: number = 1.99;

    const rice: Product = new Product("Bag of Rice", ProductUnit.Each);
    const ricePrice: number = 2.49;

    const tomatoes: Product = new Product("Box of Cherry Tomatoes", ProductUnit.Each);
    const tomatoPrice: number = 0.69;

    const toothbrush: Product = new Product("Toothbrush", ProductUnit.Each);
    const toothbrushPrice: number = 0.99;

    const toothPaste: Product = new Product("Toothpaste", ProductUnit.Each);
    const toothPastePrice: number = 1.79;

    let catalog: SupermarketCatalog;
    let teller: Teller;
    let cart: ShoppingCart;
    let receipt: Receipt;

    beforeEach(() => {
        catalog = new FakeCatalog();
        teller = new Teller(catalog);
        cart = new ShoppingCart();
    });

    afterEach(() => {
        expect(receipt).toMatchSnapshot();
    });

    it('applies a 10% discount', () => {
        const discountPercentage = 10;
        const expectedPrice = ricePrice * (1 - discountPercentage / 100);

        catalog.addProduct(rice, ricePrice);
        teller.addSpecialOffer(new PercentageOff(rice, discountPercentage));
        cart.addItemQuantity(rice, 1);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a 20% discount', () => {
        const discountPercentage = 20;
        const expectedPrice = applePrice * (1 - discountPercentage / 100);

        catalog.addProduct(apples, applePrice);
        teller.addSpecialOffer(new PercentageOff(apples, discountPercentage));
        cart.addItemQuantity(apples, 1);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies all discounts to a complex cart', () => {
        const totalToothpastePrice = 7.49 + (2 * toothPastePrice);
        const discountPercentage = 20;
        const totalApplePrice = 2 * applePrice * (1 - discountPercentage / 100);
        const expectedPrice = totalToothpastePrice + totalApplePrice;

        catalog.addProduct(toothPaste, toothPastePrice);
        catalog.addProduct(apples, applePrice);
        teller.addSpecialOffer(new FiveForAmount(toothPaste, 7.49));
        teller.addSpecialOffer(new PercentageOff(apples, discountPercentage));

        cart.addItemQuantity(toothPaste, 7);
        cart.addItemQuantity(apples, 2);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Five for Amount discount', () => {
        const expectedPrice = 7.49;

        catalog.addProduct(toothPaste, toothPastePrice);
        teller.addSpecialOffer(new FiveForAmount(toothPaste, expectedPrice));
        cart.addItemQuantity(toothPaste, 5);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Three for Two discount', () => {
        const expectedPrice = toothbrushPrice * 2;

        catalog.addProduct(toothbrush, toothbrushPrice);
        teller.addSpecialOffer(new ThreeForTwo(toothbrush, 0.0));
        cart.addItemQuantity(toothbrush, 3);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Two for Amount discount', () => {
        const expectedPrice = 0.99;

        catalog.addProduct(tomatoes, tomatoPrice);
        teller.addSpecialOffer(new TwoForAmountOffer(tomatoes, expectedPrice));
        cart.addItemQuantity(tomatoes, 2);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('does not apply unused discounts', () => {
        catalog.addProduct(tomatoes, tomatoPrice);
        catalog.addProduct(toothbrush, toothbrushPrice);
        teller.addSpecialOffer(new ThreeForTwo(toothbrush, 0.0));
        cart.addItemQuantity(tomatoes, 2);
        receipt = teller.getReceipt(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(tomatoPrice * 2);
    });
});
