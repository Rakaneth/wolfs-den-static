import CreatureList from './creatures'
import EquipList from './equip'
import HealingList from './healing'
import FoodList from './food'
import Materials from './materials'
import Entity from './entity'
import MapList from './maps'
import { Map } from 'rot-js'
import Point from './point';
import { GameMap, MapTypes, ConnectionDirections } from './gamemap'
import GameManager from './gamestate'
import { debugLog } from './utils';
import { Player, PlayerActor } from './mixin';

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

function buildCaves(opts = { width: 30, height: 30 }) {
    let gen = new Map.Cellular(opts.width || 30, opts.height || 30, { connected: true })
    let newMap = new GameMap(opts)
    gen.randomize(0.5)
    let cb = createCB(newMap)
    for (let i = 0; i < 6; i++) {
        gen.create(cb)
    }
    let seedItem = (entity => {
        entity.pos = newMap.randomFloor()
        GameManager.addEntity(entity)
    })
    let numItems = GameManager.RNG.getUniformInt(opts.minItems || 0, opts.maxItems || 0)
    for (let i = 0; i < numItems; i++) {
        let isHealing = GameManager.RNG.getUniform() > 0.5
        let table, toAdd, result
        if (isHealing) {
            table = probTableFromTags(HealingList, opts.itemTags)
            result = GameManager.RNG.getWeightedValue(table)
            toAdd = buildHeal(result, opts.id)
        } else {
            table = probTableFromTags(FoodList, opts.itemTags)
            result = GameManager.RNG.getWeightedValue(table)
            toAdd = buildFood(result, opts.id)
        }
        seedItem(toAdd)
    }
    let numEquips = GameManager.RNG.getUniformInt(opts.minEquips || 0, opts.maxEquips || 0)
    for (let j = 0; j < numEquips; j++) {
        let eqTable = probTableFromTags(EquipList, opts.equipTags)
        let eqResult = GameManager.RNG.getWeightedValue(eqTable)
        let matTable = probTableFromTags(Materials)
        let mat = GameManager.RNG.getWeightedValue(matTable)
        let eq = buildEquip(eqResult, mat, opts.id)
        seedItem(eq)
    }
    let numCreatures = GameManager.RNG.getUniformInt(opts.minCreatures || 0, opts.maxCreatures || 0)
    for (let k = 0; k < numCreatures; k++) {
        let crTable = probTableFromTags(CreatureList, opts.creatureTags)
        let crResult = GameManager.RNG.getWeightedValue(crTable)
        let cr = buildCreature(crResult, opts.id)
        seedItem(cr)
    }
    return newMap
}

function buildDigger(opts = { width: 30, height: 30 }) {
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
    let numItems = GameManager.RNG.getUniformInt(opts.minItems || 0, opts.maxItems || 0)
    let putInRoom = (r, entity) => {
        let newX = GameManager.RNG.getUniformInt(r.getLeft(), r.getRight())
        let newY = GameManager.RNG.getUniformInt(r.getTop(), r.getBottom())
        entity.pos = new Point(newX, newY)
        GameManager.addEntity(entity)
    }
    for (let i = 0; i < numItems; i++) {
        let randomRoom = GameManager.RNG.getItem(rooms)
        let isHealing = GameManager.RNG.getUniform() > 0.5
        let table, toAdd, result
        if (isHealing) {
            table = probTableFromTags(HealingList, opts.itemTags)
            result = GameManager.RNG.getWeightedValue(table)
            toAdd = buildHeal(result, opts.id)
        } else {
            table = probTableFromTags(FoodList, opts.itemTags)
            result = GameManager.RNG.getWeightedValue(table)
            toAdd = buildFood(result, opts.id)
        }
        putInRoom(randomRoom, toAdd)
    }
    let numEquips = GameManager.RNG.getUniformInt(opts.minEquips || 0, opts.maxEquips || 0)
    for (let j = 0; j < numEquips; j++) {
        let randomRoomEq = GameManager.RNG.getItem(rooms)
        let eqTable = probTableFromTags(EquipList, opts.equipTags)
        let eqResult = GameManager.RNG.getWeightedValue(eqTable)
        let matTable = probTableFromTags(Materials)
        let mat = GameManager.RNG.getWeightedValue(matTable)
        let eq = buildEquip(eqResult, mat, opts.id)
        putInRoom(randomRoomEq, eq)
    }
    let numCreatures = GameManager.RNG.getUniformInt(opts.minCreatures || 0, opts.maxCreatures || 0)
    for (let k = 0; k < numCreatures; k++) {
        let randomRoomCreat = GameManager.RNG.getItem(rooms)
        let crTable = probTableFromTags(CreatureList, opts.creatureTags)
        let crResult = GameManager.RNG.getWeightedValue(crTable)
        let cr = buildCreature(crResult, opts.id)
        putInRoom(randomRoomCreat, cr)
    }
    return newMap
}

function buildMap(mapID, opts) {
    debugLog("MAP", `Building map: ${mapID}`)
    opts.id = mapID
    let mapGens = {
        [MapTypes.CAVES]: buildCaves,
        [MapTypes.DIGGER]: buildDigger
    }

    let fn = mapGens[opts.mapType]
    let newMap = fn(opts)
    GameManager.maps[mapID] = newMap
    return newMap
}

function probTableFromTags(table, tags) {
    let cands = {}
    Object.entries(table).forEach(entry => {
        let [id, data] = entry
        if (data.frequency && (!tags || tags.some(tag => data.tags.includes(tag)))) {
            cands[id] = data.frequency
        }
    })
    return cands
}

function buildFood(buildID, mapID = null) {
    let foodOpts = FoodList[buildID]
    debugLog('FACTORY', `Building food item ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
    if (mapID) {
        foodOpts.mapID = mapID
    }
    return new Entity(foodOpts)
}

function buildHeal(buildID, mapID = null) {
    let healOpts = HealingList[buildID]
    debugLog('FACTORY', `Building healing item ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
    if (mapID) {
        healOpts.mapID = mapID
    }
    return new Entity(healOpts)
}

function buildCreature(buildID, mapID = null) {
    let creatureOpts = CreatureList[buildID]
    creatureOpts.layer = 3
    debugLog('FACTORY', `building creature ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
    if (mapID) {
        creatureOpts.mapID = mapID
    }
    let newCreature = new Entity(creatureOpts)
    if (creatureOpts.startItems) {
        creatureOpts.startItems.forEach(item => {
            let thing
            switch (true) {
                case HealingList.hasOwnProperty(item):
                    thing = buildHeal(item)
                    break;
                case FoodList.hasOwnProperty(item):
                    thing = buildFood(item)
                    break;
            }
            newCreature.addInventory(thing.id)
            GameManager.addEntity(thing)
        })
    }
    newCreature.heal()
    newCreature.restore()
    return newCreature
}

export function buildPlayer(name, buildID, mapID) {
    let baseOpts = CreatureList[buildID]
    baseOpts.layer = 4
    baseOpts.mixins = baseOpts.mixins.concat(Player, PlayerActor)
    baseOpts.mapID = mapID
    baseOpts.name = name
    baseOpts.capacity = 8
    debugLog('FACTORY', `Building player of race ${buildID} in ${mapID}`)
    let baseCreature = new Entity(baseOpts)
    if (baseOpts.startItems) {
        baseOpts.startItems.forEach(item => {
            let thing
            switch (true) {
                case HealingList.hasOwnProperty(item):
                    thing = buildHeal(item)
                    break;
                case FoodList.hasOwnProperty(item):
                    thing = buildFood(item)
                    break;
            }
            baseCreature.addInventory(thing.id)
            GameManager.addEntity(thing)
        })
    }
    baseCreature.heal()
    baseCreature.restore()
    baseCreature.pos = baseCreature.gameMap.randomFloor()
    GameManager.setCurMap(mapID)
    GameManager.addEntity(baseCreature)
    return baseCreature
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

export function buildEquip(buildID, matID = null, mapID = null) {
    let baseOpts = EquipList[buildID]
    baseOpts.layer = 2
    debugLog('FACTORY', `Building equip ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
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
    if (mapID) {
        baseOpts.mapID = mapID
    }
    return new Entity(baseOpts)
}