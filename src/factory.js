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
import { debugLog, deepClone } from './utils';
import { Player, PlayerActor } from './mixin';
import { EquipSlots } from './equipslots';
import MoneyList from './money';

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
    let gen = new Map.Cellular(opts.width || 30, opts.height || 30)
    let newMap = new GameMap(opts)
    gen.randomize(0.5)
    let cb = createCB(newMap)
    for (let i = 0; i < 6; i++) {
        gen.create(cb)
    }
    gen.connect(cb)
    let numItems = GameManager.RNG.getUniformInt(opts.minItems || 0, opts.maxItems || 0)
    for (let i = 0; i < numItems; i++) {
        let toAdd = randomItem(opts.itemTags, opts.id)
        seedItem(toAdd, newMap)
    }
    let numEquips = GameManager.RNG.getUniformInt(opts.minEquips || 0, opts.maxEquips || 0)
    for (let j = 0; j < numEquips; j++) {
        let eq = randomEq(opts.equipTags, opts.id)
        seedItem(eq, newMap)
    }
    let numCreatures = GameManager.RNG.getUniformInt(opts.minCreatures || 0, opts.maxCreatures || 0)
    for (let k = 0; k < numCreatures; k++) {
        let cr = randomCreature(opts.creatureTags, opts.id)
        seedItem(cr, newMap)
    }
    if (opts.boss) {
        debugLog('FACTORY', `Putting boss ${opts.boss} in ${opts.id}`)
        seedBoss(newMap, opts, gen)
    }
    if (opts.loot) {
        opts.loot.forEach(item => {
            let { id, mat } = item
            let lt = buildEquip(id, mat, opts.id)
            debugLog('FACTORY', `Putting guaranteed loot item ${id} in ${opts.id}`)
            seedItem(lt, newMap)
        })
    }
    return newMap
}

function seedBoss(mp, mapOpts, gen) {
    let boss = buildCreature(mapOpts.boss, mp.id)
    switch (mapOpts.mapType) {
        case MapTypes.CAVES:
            seedItem(boss, mp)
            break;
        case MapTypes.DIGGER:
            let rooms = gen.getRooms()
            let bossRoom = GameManager.RNG.getItem(rooms)
            putInRoom(bossRoom, boss)
        default:
            seedItem(boss, mp)
    }
}


function seedItem(entity, newMap) {
    entity.pos = newMap.randomFloor()
    GameManager.addEntity(entity)
}

function putInRoom(r, entity) {
    let newX = GameManager.RNG.getUniformInt(r.getLeft(), r.getRight())
    let newY = GameManager.RNG.getUniformInt(r.getTop(), r.getBottom())
    entity.pos = new Point(newX, newY)
    GameManager.addEntity(entity)
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

    for (let i = 0; i < numItems; i++) {
        let randomRoom = GameManager.RNG.getItem(rooms)
        let toAdd = randomItem(opts.itemTags, opts.id)
        putInRoom(randomRoom, toAdd)
    }
    let numEquips = GameManager.RNG.getUniformInt(opts.minEquips || 0, opts.maxEquips || 0)
    for (let j = 0; j < numEquips; j++) {
        let randomRoomEq = GameManager.RNG.getItem(rooms)
        let eq = randomEq(opts.equipTags, opts.id)
        putInRoom(randomRoomEq, eq)
    }
    let numCreatures = GameManager.RNG.getUniformInt(opts.minCreatures || 0, opts.maxCreatures || 0)
    for (let k = 0; k < numCreatures; k++) {
        let randomRoomCreat = GameManager.RNG.getItem(rooms)
        let cr = randomCreature(opts.creatureTags, opts.id)
        putInRoom(randomRoomCreat, cr)
    }
    if (opts.boss) {
        debugLog('FACTORY', `Putting boss ${opts.boss} in ${opts.id}`)
        seedBoss(newMap, opts, gen)
    }
    if (opts.loot) {
        opts.loot.forEach(item => {
            let { mat, id } = item
            let lt = buildEquip(id, mat, opts.id)
            debugLog('FACTORY', `Putting guaranteed loot item ${id} in ${opts.id}`)
            let ltRm = GameManager.RNG.getItem(rooms)
            putInRoom(ltRm, lt)
        })
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

function probTableFromTags(table, tags, matchAll = false) {
    let cands = {}
    Object.entries(table).forEach(entry => {
        let [id, data] = entry
        let yes
        if (matchAll) {
            yes = !!tags && tags.every(tag => data.tags.includes(tag))
        } else {
            yes = !!tags && tags.some(tag => data.tags.includes(tag))
        }
        if (data.frequency && (!tags || yes)) {
            cands[id] = data.frequency
        }
    })
    return cands
}

function buildFood(buildID, mapID = null) {
    let foodOpts = deepClone(FoodList[buildID])
    debugLog('FACTORY', `Building food item ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
    if (mapID) {
        foodOpts.mapID = mapID
    }
    return new Entity(foodOpts)
}

function buildHeal(buildID, mapID = null) {
    let healOpts = deepClone(HealingList[buildID])
    debugLog('FACTORY', `Building healing item ${buildID}${(mapID ? ` in map ${mapID}` : '')}`)
    if (mapID) {
        healOpts.mapID = mapID
    }
    return new Entity(healOpts)
}

function buildMoney(buildID, mapID = null) {
    let moneyOpts = deepClone(MoneyList[buildID])
    if (mapID) {
        moneyOpts.mapID = mapID
    }
    let cash = new Entity(moneyOpts)
    debugLog('FACTORY', `Giving ${cash.amt} nits`)
    return cash
}

function buildCreature(buildID, mapID = null) {
    let creatureOpts = deepClone(CreatureList[buildID])
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
                case MoneyList.hasOwnProperty(item):
                    thing = buildMoney(item)
                    break;
            }
            newCreature.addInventory(thing.id)
            GameManager.addEntity(thing)
        })
    }
    if (creatureOpts.startEquip) {
        creatureOpts.startEquip.forEach(thing => {
            let { base, mat } = thing
            let eq = buildEquip(base, mat)
            debugLog('FACTORY', `Building ${eq.name} for ${newCreature.name}`)
            newCreature.addInventory(eq.id)
            GameManager.addEntity(eq)
            newCreature.equip(eq.id)
        })
    }
    if (creatureOpts.randomEquip) {
        creatureOpts.randomEquip.forEach(list => {
            let rEQ = randomEq(list, mapID)
            debugLog('FACTORY', `Building ${rEQ.name} for ${newCreature.name}`)
            newCreature.addInventory(rEQ.id)
            GameManager.addEntity(rEQ)
            newCreature.equip(rEQ.id)
        })
    }
    newCreature.heal()
    newCreature.restore()
    return newCreature
}

function randomEq(tagList, mapID, starting = false) {
    let eqTable = probTableFromTags(EquipList, tagList)
    let eqResult = GameManager.RNG.getWeightedValue(eqTable)
    let eqOpts = EquipList[eqResult]
    let matTags = starting ? eqOpts.tags.concat('starting') : eqOpts.tags
    let matTable = probTableFromTags(Materials, matTags, starting)
    let mat = GameManager.RNG.getWeightedValue(matTable)
    return buildEquip(eqResult, mat, mapID)
}

function randomCreature(tagList, mapID) {
    let crTable = probTableFromTags(CreatureList, tagList)
    let crResult = GameManager.RNG.getWeightedValue(crTable)
    return buildCreature(crResult, mapID)
}

function randomItem(tagList, mapID) {
    let isHealing = GameManager.RNG.getUniform() > 0.5
    let table, toAdd, result
    if (isHealing) {
        table = probTableFromTags(HealingList, tagList)
        result = GameManager.RNG.getWeightedValue(table)
        toAdd = buildHeal(result, mapID)
    } else {
        table = probTableFromTags(FoodList, tagList)
        result = GameManager.RNG.getWeightedValue(table)
        toAdd = buildFood(result, mapID)
    }
    return toAdd
}

export function buildPlayer(name, buildID, mapID) {
    let baseOpts = deepClone(CreatureList[buildID])
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
    if (baseOpts.startEquip) {
        baseOpts.startEquip.forEach(thing => {
            let { base, mat } = thing
            let eq = buildEquip(base, mat)
            baseCreature.addInventory(eq.id)
            GameManager.addEntity(eq)
            baseCreature.equip(eq.id)
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
    let baseOpts = {}
    Object.entries(EquipList[buildID]).forEach(e => {
        let [k, v] = e
        baseOpts[k] = v
    })
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