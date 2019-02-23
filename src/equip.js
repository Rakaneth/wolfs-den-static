import Swatch from './swatch'
import { EquipSlots, DamageTypes, EquipTypes } from './equipslots';
import { Carryable, Position, Drawable, Equipment } from './mixin';

const markTags = [
    'holy',
    'dragon',
    'trinket'
]

const naturalWeaponTags = [
    'weapon',
    'natural'
]

const baseWeaponTags = ['weapon']
const baseArmorTags = ['armor']


const baseMixins = [
    Carryable,
    Position,
    Drawable,
    Equipment
]

let EquipList = {
    whiteMark: {
        name: 'Mark of Ilma',
        desc: "A holy symbol of the dragon Il'ma'to'ee'rey",
        slot: EquipSlots.TRINKET,
        glyph: '=',
        dmg: 2,
        tags: markTags,
        mixins: baseMixins
    },
    blackMark: {
        name: 'Mark of Barma',
        desc: 'A holy symbol of the dragon Yalakhbarma',
        slot: EquipSlots.TRINKET,
        glyph: '=',
        tou: 5,
        res: 5,
        tags: markTags,
        color: Swatch.blackMark,
        mixins: baseMixins
    },
    redMark: {
        name: 'Mark of Mekira',
        desc: 'A holy symbol of the dragon Xilomekira',
        slot: EquipSlots.TRINKET,
        glyph: '=',
        atp: 5,
        pwr: 5,
        tags: markTags,
        color: Swatch.redMark,
        mixins: baseMixins
    },
    greenMark: {
        name: 'Mark of Sansa',
        desc: 'A holy symbol of the dragon Sansapradava',
        slot: EquipSlots.TRINKET,
        glyph: '=',
        dfp: 5,
        res: 5,
        tags: markTags,
        color: Swatch.greenMark,
        mixins: baseMixins
    },
    blueMark: {
        name: 'Mark of Atara',
        desc: 'A holy symbol of the dragon Ataramakaris',
        slot: EquipSlots.TRINKET,
        glyph: '=',
        wil: 5,
        pwr: 5,
        tags: markTags,
        color: Swatch.blueMark,
        mixins: baseMixins
    },
    axe: {
        name: '<material> axe',
        desc: 'A large axe made from <material>',
        slot: EquipSlots.WEAPON,
        glyph: '\u002F',
        material: true,
        atp: -5,
        dmg: 10,
        damageType: DamageTypes.SLASH,
        equipType: EquipTypes.AXE,
        mixins: baseMixins,
        tags: baseWeaponTags.concat('metal', 'bone', 'axe'),
        frequency: 5
    },
    sword: {
        name: '<material> sword',
        desc: 'A shortsword made from <material>',
        slot: EquipSlots.WEAPON,
        glyph: '\u007C',
        material: true,
        atp: 5,
        dmg: 6,
        damageType: DamageTypes.SLASH,
        equipType: EquipTypes.SWORD,
        tags: baseWeaponTags.concat('metal', 'bone', 'sword'),
        mixins: baseMixins,
        frequency: 5
    },
    staff: {
        name: '<material> staff',
        desc: 'A long staff made from <material>',
        slot: EquipSlots.WEAPON,
        glyph: '\u00F4',
        material: true,
        pwr: 5,
        wil: 5,
        dmg: 3,
        damageType: DamageTypes.MAGIC,
        equipType: EquipTypes.STAFF,
        tags: baseWeaponTags.concat('bone', 'wood', 'staff', 'magic'),
        mixins: baseMixins,
        frequency: 3
    },
    rapier: {
        name: '<material> rapier',
        desc: 'A slender rapier made from <material>',
        slot: EquipSlots.WEAPON,
        glyph: '\u0019',
        material: true,
        atp: 10,
        dmg: 4,
        damageType: DamageTypes.PIERCE,
        equipType: EquipTypes.LIGHT,
        tags: baseWeaponTags.concat('metal', 'light'),
        mixins: baseMixins,
        frequency: 3
    },
    chain: {
        name: '<material> chain',
        desc: 'A chain hauberk made from <material>',
        slot: EquipSlots.ARMOR,
        glyph: ')',
        material: true,
        dfp: 7,
        equipType: EquipTypes.ARMOR,
        tags: baseArmorTags.concat('metal', 'armor'),
        mixins: baseMixins,
        frequency: 2
    },
    breastplate: {
        name: '<material> breastplate',
        desc: 'Armor covering the chest and torso, made from <material>',
        slot: EquipSlots.ARMOR,
        glyph: ']',
        material: true,
        dfp: 5,
        equipType: EquipTypes.ARMOR,
        tags: baseArmorTags.concat('metal', 'leather', 'bone', 'armor'),
        mixins: baseMixins,
        frequency: 4
    },
    'sun-blade': {
        name: 'Sun Blade',
        desc: 'A golden blade shining like the sun.',
        slot: EquipSlots.WEAPON,
        glyph: '|',
        atp: 10,
        wil: 10,
        pwr: 10,
        dmg: 10,
        equipType: EquipTypes.SWORD,
        damageType: DamageTypes.MAGIC,
        tags: baseWeaponTags.concat('magic', 'sun'),
        mixins: baseMixins,
    },
    'wizards-staff': {
        name: '<material> wizard\'s staff',
        desc: 'A typical wizard\'s staff made from <material>',
        slot: EquipSlots.WEAPON,
        glyph: '\u00F4',
        wil: 10,
        pwr: 10,
        res: 10,
        equipType: EquipTypes.STAFF,
        damageType: DamageTypes.MAGIC,
        tags: baseWeaponTags.concat('staff', 'magic'),
        mixins: baseMixins
    }
}

export default EquipList
