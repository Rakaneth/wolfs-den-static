import { ConnectionDirections, MapTypes } from './gamemap'
import Swatch from './swatch'

let MapList = {
    'mine-upper': {
        name: 'Mines (Upper)',
        width: 50,
        height: 30,
        mapType: MapTypes.DIGGER,
        creatureTags: ['wolf'],
        minCreatures: 20,
        maxCreatures: 30,
        wallColor: Swatch.darkStone,
        floorColor: Swatch.lightStone,
        maxItems: 10,
        maxEquips: 5,
        zone: 'wolf-cave',
        connections: [
            {
                mapID: 'mine-lower',
                twoWay: true,
                direction: ConnectionDirections.DOWN
            }
        ]
    },
    'mine-lower': {
        name: 'Mines (Lower)',
        width: 50,
        height: 30,
        mapType: MapTypes.DIGGER,
        creatureTags: ['wolf'],
        minCreatures: 30,
        maxCreatures: 35,
        minItems: 3,
        maxItems: 10,
        minEquips: 1,
        maxEquips: 10,
        wallColor: Swatch.darkStone,
        floorColor: Swatch.lightStone,
        zone: 'wolf-cave',
        connections: [
            {
                mapID: 'caves-upper',
                twoWay: true,
                direction: ConnectionDirections.DOWN
            }
        ]
    },
    'caves-upper': {
        name: 'Caves (Upper)',
        width: 50,
        height: 30,
        mapType: MapTypes.CAVES,
        creatureTags: ['wolf', 'undead'],
        minCreatures: 20,
        maxCreatures: 30,
        wallColor: Swatch.darkStone,
        floorColor: Swatch.lightStone,
        minItems: 3,
        maxItems: 10,
        minEquips: 1,
        maxEquips: 10,
        zone: 'wolf-cave',
        connections: [
            {
                mapID: 'caves-lower',
                twoWay: true,
                direction: ConnectionDirections.DOWN
            }
        ],
        lit: false
    },
    'caves-lower': {
        name: 'Caves (Lower)',
        width: 50,
        height: 30,
        mapType: MapTypes.CAVES,
        creatureTags: ['wolf', 'undead'],
        minCreatures: 15,
        maxCreatures: 25,
        wallColor: Swatch.darkStone,
        floorColor: Swatch.lightStone,
        minItems: 1,
        maxItems: 10,
        maxEquips: 5,
        zone: 'wolf-cave',
        connections: [
            {
                mapID: 'crypt',
                twoWay: true,
                direction: ConnectionDirections.DOWN
            }
        ],
        lit: false
    },
    crypt: {
        name: 'Crypt',
        width: 100,
        height: 100,
        mapType: MapTypes.DIGGER,
        creatureTags: ['undead'],
        minCreatures: 10,
        maxCreatures: 20,
        floorColor: Swatch.lightStone,
        wallColor: Swatch.darkStone,
        maxItems: 20,
        minEquips: 1,
        maxEquips: 10,
        zone: 'wolf-cave',
        boss: 'crypt-lord',
        loot: [
            {
                id: 'sun-blade'
            },
            {
                id: 'wizards-staff',
                mat: 'bone'
            }
        ],
        lit: false
    }
}

export default MapList