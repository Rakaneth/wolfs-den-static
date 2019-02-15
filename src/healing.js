import Swatch from './swatch'
import { Position, Carryable, Drawable, Healing } from './mixin';

let healingMixins = [
    Position,
    Carryable,
    Drawable,
    Healing,
]

let healingTags = [
    'healing',
    'consumable'
]

let HealingList = {
    bandages: {
        name: 'bandages',
        desc: 'Bandages and salves from a healer\'s kit',
        amt: 0.1,
        mixins: healingMixins,
        tags: healingTags,
        glyph: '~',
        color: Swatch.white,
        frequency: 6
    },
    potion: {
        name: 'healing potion',
        desc: 'A vinegary concoction that assists in the closing of wounds.',
        amt: 0.2,
        mixins: healingMixins,
        tags: healingTags,
        glyph: '!',
        color: Swatch.crimson,
        frequency: 3
    }
}

export default HealingList