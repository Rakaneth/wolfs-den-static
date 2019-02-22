import { ConnectionDirections, MapTypes } from './gamemap'
import Swatch from './swatch'

let MapList = {
    'mine-upper': {
        name: 'Mines (Upper)',
        width: 85,
        height: 85,
        mapType: MapTypes.DIGGER,
        creatureTags: ['wolf'],
        minCreatures: 20,
        maxCreatures: 30,
        maxItems: 10,
        maxEquips: 5,
        wallColor: Swatch.darkerSepia,
        floorColor: Swatch.sepia,
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
        width: 85,
        height: 85,
        mapType: MapTypes.DIGGER,
        creatureTags: ['wolf'],
        minCreatures: 30,
        maxCreatures: 35,
        minItems: 3,
        maxItems: 10,
        minEquips: 1,
        maxEquips: 10,
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
        width: 100,
        height: 100,
        mapType: MapTypes.CAVES,
        creatureTags: ['wolf', 'undead'],
        minCreatures: 20,
        maxCreatures: 30,
        wallColor: 'darkgrey',
        floorColor: 'grey',
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
        width: 100,
        height: 100,
        mapType: MapTypes.CAVES,
        creatureTags: ['wolf', 'undead'],
        minCreatures: 15,
        maxCreatures: 25,
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
        width: 150,
        height: 150,
        mapType: MapTypes.DIGGER,
        creatureTags: ['undead'],
        minCreatures: 10,
        maxCreatures: 20,
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