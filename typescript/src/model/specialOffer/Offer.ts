import {Product} from "../Product"
import {SpecialOfferType} from "./SpecialOfferType"
import {OfferInterface} from "./OfferInterface";

export class Offer implements OfferInterface {

    public constructor(public readonly offerType: SpecialOfferType,
                       public readonly product: Product,
                       public readonly argument: number) {
    }

}
