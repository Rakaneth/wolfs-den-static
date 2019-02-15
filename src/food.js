import { Position, Food, Drawable, Carryable } from "./mixin";
import Swatch from './swatch'

let foodMixins = [
    Position,
    Food,
    Drawable,
    Carryable,
]

let foodTags = [
    'food',
    'consumable'
]

let FoodList = {
    ration: {
        name: 'rations',
        desc: 'Salted meat and hard tack',
        amt: 0.1,
        mixins: foodMixins,
        tags: foodTags,
        glyph: '\u003B',
        color: Swatch.iron,
        frequency: 10
    },
    dwarfBread: {
        name: 'dwarfbread',
        desc: 'A satisfying, tasty, loaf of bread, a speciality of Dwarves',
        amt: 0.25,
        mixins: foodMixins,
        tags: foodTags,
        glyph: '\u003B',
        color: Swatch.steel,
        frequency: 5
    },
    rawMeat: {
        name: 'raw meat',
        desc: 'A hunk of raw meat, torn from some beast.',
        amt: 0.05,
        mixins: foodMixins,
        tags: foodTags,
        glyph: '\u003B',
        color: Swatch.flesh,
        frequency: 20
    }
}

export default FoodList