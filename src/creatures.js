import Swatch from './swatch'
import { Blocker, Mover, Position, Drawable, PrimaryStats, EquipWearer, MoneyTaker, DerivedStats } from './mixin';

const humanStartItems = [
    'ration',
    'ration',
    'potion',
    'potion'
]

const edStartItems = [
    'ration',
    'potion'
]

const humanTags = [
    'humanoid',
    'human'
]
const standardMixins = [
    Blocker,
    Mover,
    Position,
    Drawable,
    PrimaryStats
]

const huamoidMixins = standardMixins.concat(EquipWearer, MoneyTaker)
const animalMixins = standardMixins.concat(DerivedStats)

let CreatureList = {
    native: {
        name: 'Salabanian',
        desc: 'Human of Salaban',
        startItems: humanStartItems,
        frequency: 10,
        tags: humanTags,
        mixins: huamoidMixins
    },
    keldun: {
        name: 'Keldunian',
        desc: 'Human of Keldun',
        startItems: humanStartItems,
        frequency: 8,
        tags: humanTags,
        mixins: huamoidMixins
    },
    elf: {
        name: 'Elf',
        desc: 'Elf of Fang Wood',
        stam: 5,
        spd: 15,
        startItems: edStartItems,
        frequency: 5,
        tags: [
            'humanoid',
            'elf'
        ],
        mixins: huamoidMixins
    },
    dwarf: {
        name: 'Dwarf',
        desc: 'Dwarf of Mithril Gate',
        stam: 15,
        spd: 5,
        startItems: edStartItems,
        frequency: 6,
        tags: [
            'humanoid',
            'dwarf'
        ],
        mixins: huamoidMixins
    },
    wolfborn: {
        name: 'Wolf-born',
        desc: 'Wolf-born of the Fang Wood',
        str: 15,
        stam: 15,
        smt: 5,
        skl: 5,
        frequency: 3,
        tags: [
            'humanoid',
            'wolf',
            'shapechanger'
        ],
        mixins: huamoidMixins
    },
    wolf: {
        name: 'wolf',
        desc: 'A large, grey wolf',
        unarmed: 'fangs',
        glyph: 'W',
        color: Swatch.sepia,
        str: 15,
        spd: 15,
        atp: 2,
        frequency: 10,
        tags: [
            'animal',
            'wolf'
        ],
        enemies: [
            'humanoid'
        ],
        mixins: animalMixins
    }
}

export default CreatureList