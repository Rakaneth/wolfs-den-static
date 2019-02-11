import Swatch from './swatch'

class Tile {
    constructor(display, color = null, walk = true, see = true) {
        this.display = display
        this.walk = walk
        this.see = see
        this.color = color
    }
}

let Tiles = {
    'null-tile': new Tile('\u0000', false, false),
    'floor': new Tile(' '), //Floor
    'wall': new Tile('\u2588', false, false), //Wall
    'door-closed': new Tile('+', false, false, Swatch.sepia), //closed door
    'door-open': new Tile('/', Swatch.sepia) //open door
}

export default Tiles