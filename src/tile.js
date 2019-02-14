import Swatch from './swatch'

class Tile {
    constructor(display, color = null, bg = null, walk = true, see = true) {
        this.display = display
        this.walk = walk
        this.see = see
        this.color = color
        this.bg = bg
    }
}

let Tiles = {
    'null-tile': new Tile('\u0000', null, null, false, false),
    'floor': new Tile(' '), //Floor
    'wall': new Tile(' ', null, false, false), //Wall
    'door-closed': new Tile('+', Swatch.white, Swatch.darkSepia, false, false), //closed door
    'door-open': new Tile('/', Swatch.white, Swatch.darkSepia), //open door
    'stairs-down': new Tile('>', Swatch.yellow),
    'stairs-up': new Tile('<', Swatch.yellow),
    'door-out': new Tile('\u03A0', Swatch.sepia)
}

export default Tiles