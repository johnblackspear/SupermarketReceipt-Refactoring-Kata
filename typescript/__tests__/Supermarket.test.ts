import {FakeCatalog} from "./FakeCatalog"
import {Product} from "../src/model/Product"
import {SupermarketCatalog} from "../src/model/SupermarketCatalog"
import {ProductUnit} from "../src/model/ProductUnit"
import {ShoppingCart} from "../src/model/ShoppingCart";
import {Teller} from "../src/model/Teller";
import {SpecialOfferType} from "../src/model/SpecialOfferType";
import {Receipt} from "../src/model/Receipt";

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
    
    it('applies a 10% discount', function () {
        const discountPercentage = 10;
        const expectedPrice = ricePrice * (1 - discountPercentage / 100);
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(rice, ricePrice);
        teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, rice, discountPercentage);
        cart.addItemQuantity(rice, 1);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a 20% discount', function () {
        const discountPercentage = 20;
        const expectedPrice = applePrice * (1 - discountPercentage / 100);
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(apples, applePrice);
        teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apples, discountPercentage);
        cart.addItemQuantity(apples, 1);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Five for Amount discount', function () {
        const expectedPrice = 7.49;
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(toothPaste, toothPastePrice);
        teller.addSpecialOffer(SpecialOfferType.FiveForAmount, toothPaste, expectedPrice);
        cart.addItemQuantity(toothPaste, 5);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Three for Two discount', function () {
        const expectedPrice = toothbrushPrice * 2;
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(toothbrush, toothbrushPrice);
        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 0.0);
        cart.addItemQuantity(toothbrush, 3);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

    it('applies a Two for Amount discount', function () {
        const expectedPrice = 0.99;
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(tomatoes, tomatoPrice);
        teller.addSpecialOffer(SpecialOfferType.TwoForAmount, tomatoes, expectedPrice);
        cart.addItemQuantity(tomatoes, 2);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });
});
