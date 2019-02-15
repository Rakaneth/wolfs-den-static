import Swatch from './swatch'
import { Blocker, Mover, Position, Drawable, PrimaryStats, EquipWearer, MoneyTaker, DerivedStats, Vitals, Vision, Inventory } from './mixin';

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
const wolfTags = [
    'animal',
    'wolf'
]
const undeadTags = [
    'undead'
]
const standardMixins = [
    Blocker,
    Mover,
    Position,
    Drawable,
    PrimaryStats,
    Vision,
    Vitals
]

const huamoidMixins = standardMixins.concat(EquipWearer, MoneyTaker, Inventory)
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
        dmg: 2,
        frequency: 10,
        tags: wolfTags,
        enemies: [
            'humanoid'
        ],
        mixins: animalMixins
    },
    zombie: {
        name: 'zombie',
        desc: 'Once an adventurer, now a reeking, animated corpse',
        glyph: 'Z',
        color: Swatch.purple,
        str: 20,
        spd: 5,
        atp: -5,
        dmg: 2,
        frequency: 5,
        tags: undeadTags,
        enemies: ['humanoid', 'animal'],
        mixins: huamoidMixins
    }
}

export default CreatureList