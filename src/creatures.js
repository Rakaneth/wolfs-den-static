import Swatch from './swatch'
import { Blocker, Mover, Position, Drawable, PrimaryStats, EquipWearer, MoneyTaker, DerivedStats, Vitals, Vision, Inventory, Faction, DoorOpener, Corpse, WaitActor } from './mixin';

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
    Vitals,
    Faction
]

const humanoidMixins = standardMixins.concat(EquipWearer, MoneyTaker, Inventory, DoorOpener, Corpse)
const animalMixins = standardMixins.concat(DerivedStats, Corpse, WaitActor)

let CreatureList = {
    native: {
        name: 'Salabanian',
        desc: 'Human of Salaban',
        startItems: humanStartItems,
        frequency: 10,
        tags: humanTags,
        mixins: humanoidMixins,
        randomEquip: [
            ['axe'],
            ['armor', 'leather']
        ]
    },
    keldun: {
        name: 'Keldunian',
        desc: 'Human of Keldun',
        startItems: humanStartItems.concat('poorDrop'),
        frequency: 8,
        tags: humanTags,
        mixins: humanoidMixins,
        startEquip: [
            { base: 'sword', mat: 'iron' },
            { base: 'breastplate', mat: 'wolfHide' }
        ],
        randomEquip: [
            ['sword', 'axe', 'light'],
            ['armor']
        ]
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
        randomEquip: [
            ['staff']
        ],
        mixins: humanoidMixins
    },
    dwarf: {
        name: 'Dwarf',
        desc: 'Dwarf of Mithril Gate',
        stam: 15,
        spd: 5,
        startItems: edStartItems.concat('medDrop'),
        frequency: 6,
        tags: [
            'humanoid',
            'dwarf'
        ],
        mixins: humanoidMixins,
        edrMult: 2.3,
        vitMult: 1.3,
        randomEquip: [
            ['axe', 'metal'],
            ['armor', 'metal'],
        ]
    },
    wolfborn: {
        name: 'Wolf-born',
        desc: 'Wolf-born of the Fang Wood',
        color: Swatch.sepia,
        str: 15,
        stam: 15,
        smt: 5,
        skl: 5,
        dmg: 2,
        frequency: 3,
        tags: [
            'humanoid',
            'wolf',
            'shapechanger'
        ],
        randomEquip: [
            ['leather', 'armor'],
            ['axe', 'weapon']
        ],
        mixins: humanoidMixins,
        edrMult: 2.5,
        vitMult: 1.5,
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
        allies: [
            'wolf',
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
        mixins: humanoidMixins,
        randomEquip: [
            ['sword', 'axe', 'hammer'],
            ['armor']
        ],
        excludeEqTags: ['blackiron']
    },
    'crypt-lord': {
        name: 'The Margrave of Bones',
        desc: 'A frightening crature, thin as a rail, radiating menace',
        str: 50,
        stam: 45,
        spd: 30,
        skl: 30,
        sag: 35,
        smt: 50,
        dmg: 5,
        color: Swatch.purple,
        glyph: '@',
        tags: undeadTags,
        enemies: ['humanoid', 'animal'],
        mixins: humanoidMixins,
        startItems: ['richDrop', 'richDrop', 'richDrop', 'medDrop'],
        startEquip: [
            { base: 'fellhammer' }
        ]
    }
}

export default CreatureList