import Tiles from './tile'
import { between, listRemove, clamp } from './utils'
import Swatch from './swatch'
import GameManager from './gamestate'
import Point from './point';

export let ConnectionDirections = {
    DOWN: "down",
    OUT: "out",
    UP: "up"
}

export let MapTypes = {
    DIGGER: 'digger',
    CAVES: 'caves'
}

let connsChart = {
    [ConnectionDirections.DOWN]: {
        tile: 'stairs-down',
        opp: ConnectionDirections.UP
    },
    [ConnectionDirections.UP]: {
        tile: 'stairs-up',
        opp: ConnectionDirections.DOWN
    },
    [ConnectionDirections.OUT]: {
        tile: 'door-out',
        opp: ConnectionDirections.OUT
    }
}

export class GameMap {
    constructor(opts = { width: 30, height: 30, id: 'no mapID' }) {
        this._tiles = new Array(opts.height).fill(0).map(() => new Array(opts.width).fill(Tiles['null-tile']))
        this._explored = new Array(opts.height).fill(0).map(() => new Array(opts.width).fill(false))
        this.id = opts.id || "no mapID"
        this.width = opts.width || 30
        this.height = opts.height || 30
        this.lit = typeof (opts.lit) === 'undefined' ? true : opts.lit
        this._connections = {}
        this.wallColor = opts.wallColor || Swatch.sepia
        this.floorColor = opts.floorColor || Swatch.darkSepia
        this.floors = []
    }

    getTile(pt) {
        return this.isOOB(pt) ? Tiles['null-tile'] : this._tiles[pt.y][pt.x]
    }

    setTile(pt, tileName) {
        let t = Tiles[tileName]
        this._tiles[pt.y][pt.x] = t
        if (t.walk) {
            this.floors.push(pt)
        } else {
            this.floors = listRemove(this.floors, pt)
        }
    }

    isOOB(pt) {
        return !(between(pt.x, 0, this.width - 1) && between(pt.y, 0, this.height - 1))
    }

    isWalkable(pt) {
        return this.getTile(pt).walk
    }

    isTransparent(pt) {
        return this.getTile(pt).see
    }

    isExplored(pt) {
        return this._explored[pt.y][pt.x]
    }

    isClosedDoor(pt) {
        return this.getTile(pt) === Tiles['door-closed']
    }

    isOpenDoor(pt) {
        return this.getTile(pt) === Tiles['door-open']
    }

    explore(pt) {
        this._explored[pt.y][pt.x] = true
    }

    connect(connectOpts) {
        this._connections[connectOpts.fromPt.toString()] = {
            toPt: connectOpts.toPt,
            mapID: connectOpts.mapID
        }
        let { tile, opp } = connsChart[connectOpts.direction]
        this.setTile(connectOpts.fromPt, tile)
        if (connectOpts.twoWay) {
            let otherMap = GameManager.mapByID(connectOpts.mapID)
            otherMap.connect({
                fromPt: connectOpts.toPt,
                toPt: connectOpts.fromPt,
                mapID: this.id,
                direction: opp
            })
        }
    }

    getConnection(pt) {
        return this._connections[pt.toString()]
    }

    randomFloor(pt = null, radius = 0) {
        let cands
        if (pt && radius) {
            cands = this.floors.filter(f => pt.distance(f) <= radius)
        } else {
            cands = this.floors
        }
        return GameManager.RNG.getItem(cands)
    }

    cam(pt, sw, sh) {
        let calc = (p, md, s) => {
            return clamp(p - s / 2, 0, Math.max(0, md - s))
        }
        let left = calc(pt.x, this.width, sw)
        let top = calc(pt.y, this.height, sh)
        return new Point(left, top)
    }
}






