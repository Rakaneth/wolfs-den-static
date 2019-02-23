import Swatch from './swatch'
import { MoneyDrop, Carryable, Position, Drawable } from './mixin'

const defaultMixins = [
    MoneyDrop,
    Carryable,
    Position,
    Drawable
]

const moneyTags = ['money']

let MoneyList = {
    poorDrop: {
        glyph: '$',
        color: Swatch.silver,
        desc: 'A handful of silver coins',
        name: 'silver nits',
        minCoins: 1,
        maxCoins: 8,
        mixins: defaultMixins,
        tags: moneyTags,
        frequency: 5,
    },
    medDrop: {
        glyph: '$',
        color: Swatch.silver,
        desc: 'A large handful of silver coins',
        name: 'silver nits',
        minCoins: 9,
        maxCoins: 16,
        mixins: defaultMixins,
        tags: moneyTags,
        frequency: 3,  
    },
    richDrop: {
        glyph: '$',
        color: Swatch.gold,
        desc: 'A handful of silver and gold coins',
        name: 'silver nits',
        minCoins: 17,
        maxCoins: 32,
        mixins: defaultMixins,
        tags: moneyTags,
        frequency: 1,
    }
}

export default MoneyList