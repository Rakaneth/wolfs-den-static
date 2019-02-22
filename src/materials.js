import Swatch from './swatch'

let Materials = {
    oak: {
        name: 'oak',
        color: Swatch.oak,
        hardness: 10,
        staff: {
            pwr: 5,
            wil: 5
        },
        hammer: {
            dmg: 1
        },
        frequency: 3,
        tags: ['wood', 'starting']
    },
    iron: {
        name: 'iron',
        color: Swatch.iron,
        hardness: 20,
        sword: {
            dmg: 2
        },
        axe: {
            dmg: 2
        },
        hammer: {
            atp: -5,
            dmg: 3
        },
        armor: {
            atp: -5
        },
        frequency: 5,
        tags: ['metal', 'starting']
    },
    steel: {
        name: 'steel',
        color: Swatch.steel,
        hardness: 30,
        sword: {
            dmg: 3,
            atp: 5
        },
        axe: {
            dmg: 4
        },
        hammer: {
            dmg: 5
        },
        armor: {
            atp: -10
        },
        light: {
            atp: 10,
            dmg: 2
        },
        frequency: 4,
        tags: ['metal'],
    },
    bone: {
        name: 'bone',
        color: Swatch.bone,
        hardness: 5,
        sword: {
            atp: 5,
            dmg: -1,
            pwr: 5
        },
        armor: {
            pwr: 5,
            res: 10
        },
        staff: {
            pwr: 10,
            wil: 5
        },
        frequency: 2,
        tags: ['bone']
    },
    blackiron: {
        name: 'blackiron',
        color: Swatch.blackiron,
        hardness: 40,
        sword: {
            atp: 5,
            dmg: 3,
            res: 5,
            pwr: -10,
            wil: -10
        },
        axe: {
            dmg: 4,
            res: 5,
            pwr: -10,
            wil: -10
        },
        light: {
            atp: 10,
            dmg: 2,
            res: 5,
            pwr: -10,
            wil: -10
        },
        hammer: {
            dmg: 5,
            res: 5,
            pwr: -10,
            wil: -10
        },
        armor: {
            res: 10,
            pwr: -20,
            wil: -20
        },
        frequency: 1,
        tags: ['metal']
    },
    wolfHide: {
        name: 'wolf-hide',
        color: Swatch.sepia,
        hardness: 5,
        armor: {
            res: 1,
        },
        frequency: 5,
        tags: ['leather', 'starting']
    }
}

export default Materials