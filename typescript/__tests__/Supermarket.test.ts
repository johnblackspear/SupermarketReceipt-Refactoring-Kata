import {FakeCatalog} from "./FakeCatalog"
import {Product} from "../src/model/Product"
import {SupermarketCatalog} from "../src/model/SupermarketCatalog"
import {ProductUnit} from "../src/model/ProductUnit"
import {ShoppingCart} from "../src/model/ShoppingCart";
import {Teller} from "../src/model/Teller";
import {SpecialOfferType} from "../src/model/SpecialOfferType";
import {Receipt} from "../src/model/Receipt";

describe('Supermarket', function () {
    
    it('applies a three for two discount', function () {
        const toothbrush: Product = new Product("Toothbrush", ProductUnit.Each);
        const toothbrushPrice: number = 0.99;
        const expectedPrice = toothbrushPrice * 2;
        const catalog: SupermarketCatalog = new FakeCatalog();
        const teller: Teller = new Teller(catalog);
        const cart: ShoppingCart = new ShoppingCart();

        catalog.addProduct(toothbrush, toothbrushPrice);
        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 10.0);
        cart.addItemQuantity(toothbrush, 3);
        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(expectedPrice);
    });

});
