import CreatureList from './creatures'
import EquipList from './equip'
//import ItemList from './items'
import Materials from './materials'
import Entity from './entity'
import { EquipTypes } from './equipslots';
import MapList from './maps'
import { Map } from 'rot-js'
import Point from './point';
import { GameMap, MapTypes, ConnectionDirections } from './gamemap'
import GameManager from './gamestate'
import { debugLog } from './utils';

function createCB(gMap) {
    return function (x, y, v) {
        let pt = new Point(x, y)
        if (v) {
            gMap.setTile(pt, 'wall')
        } else {
            gMap.setTile(pt, 'floor')
        }
    }
}

function buildCaves(opts = { width: 30, height: 30, id: 'no mapID' }) {
    let gen = new Map.Cellular(opts.width || 30, opts.height || 30, { connected: true })
    let newMap = new GameMap(opts)
    gen.randomize(0.5)
    let cb = createCB(newMap)
    for (let i = 0; i < 6; i++) {
        gen.create(cb)
    }
    return newMap
}

function buildDigger(opts = { width: 30, height: 30, id: 'no mapID' }) {
    let gen = new Map.Digger(opts.width, opts.height)
    let newMap = new GameMap(opts)
    gen.create(createCB(newMap))
    let rooms = gen.getRooms()
    rooms.forEach((room) => {
        room.getDoors((x, y) => {
            let pt = new Point(x, y)
            newMap.setTile(pt, 'door-closed')
        })
    })
    return newMap
}

function buildMap(mapID, opts) {
    debugLog("MAP", `Building map: ${mapID}`)
    let mapGens = {
        [MapTypes.CAVES]: buildCaves,
        [MapTypes.DIGGER]: buildDigger
    }

    let fn = mapGens[opts.mapType]
    let newMap = fn(opts)
    GameManager.maps[mapID] = newMap
    return newMap
}

export function buildAllMaps() {
    Object.entries(MapList).forEach(entry => {
        let [mapID, opts] = entry
        let curMap = GameManager.mapByID(mapID) || buildMap(mapID, opts)
        if (opts.connections) {
            opts.connections.forEach(conn => {
                let toOpts = MapList[conn.mapID]
                let toMap = GameManager.mapByID(conn.mapID) || buildMap(conn.mapID, toOpts)
                debugLog("MAP", `Connecting ${mapID} to ${conn.mapID}`)
                let connOpts
                if (opts.zone === toOpts.zone) {
                    let matchingFloors = curMap.floors.filter(fl => toMap.isWalkable(fl))
                    let pt = GameManager.RNG.getItem(matchingFloors)
                    connOpts = {
                        fromPt: pt,
                        toPt: pt,
                        twoWay: conn.twoWay,
                        direction: conn.direction,
                        mapID: conn.mapID
                    }
                } else {
                    connOpts = {
                        fromPt: curMap.randomFloor(),
                        toPt: toMap.randomFloor(),
                        twoWay: conn.twoWay,
                        direction: conn.direction,
                        mapID: conn.mapID
                    }
                }
                curMap.connect(connOpts)
            })
        }
    })
}

export function buildEquip(buildID, matID = null) {
    let baseOpts = EquipList[buildID]
    if (!baseOpts) {
        throw new Error(`BuildID ${buildID} does not exist in equip list.`)
    }
    if (baseOpts.material) {
        if (!matID) {
            throw new Error(`BuildID ${buildID} must be made of a material.`)
        }
        let mat = Materials[matID]
        if (!mat) {
            throw new Error(`Material ID ${matID} doesn't exist in material list.`)
        }
        baseOpts.name = baseOpts.name.replace('<material>', mat.name)
        baseOpts.desc = baseOpts.desc.replace('<material>', mat.name)
        let matStats = mat[baseOpts.equipType]
        if (matStats) {
            Object.keys(matStats).forEach(stat => {
                baseOpts[stat] = (baseOpts[stat] || 0) + matStats[stat]
            })
        }
        baseOpts.color = mat.color
        baseOpts.hardness = mat.hardness
    }
    return new Entity(baseOpts)
}