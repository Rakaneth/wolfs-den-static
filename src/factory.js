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

class MapBuilder {
    constructor(gen, opts, isRoomer = false) {
        this._gen = gen
        this._opts = opts
        this._map = new GameMap(opts)
        this._isRoomer = isRoomer
        let cb = (x, y, v) => {
            let pt = new Point(x, y)
            if (v) {
                this._map.setTile(pt, 'wall')
            } else {
                this._map.setTile(pt, 'floor')
            }
        }
        if (this._isRoomer) {
            this._gen.create(cb)
            let rooms = this._gen.getRooms()
            rooms.forEach(room => {
                room.getDoors((x, y) => {
                    let pt = new Point(x, y)
                    this._map.setTile(pt, 'door-closed')
                })
            })
        } else {
            this._gen.randomize(0.5)
            for (let i = 0; i < 6; i++) {
                this._gen.create(cb)
            }
            this._gen.connect(cb)
        }
    }

    _seedEntity(entity) {
        if (this._isRoomer) {
            let whichRoom = GameManager.RNG.getItem(this._gen.getRooms())
            this._putinRoom(entity, whichRoom)
        } else {
            entity.pos = this._map.randomFloor()
            GameManager.addEntity(entity)
        }
    }

    _putinRoom(entity, room) {
        let newX = GameManager.RNG.getUniformInt(room.getLeft(), room.getRight())
        let newY = GameManager.RNG.getUniformInt(room.getTop(), room.getBottom())
        entity.pos = new Point(newX, newY)
        GameManager.addEntity(entity)
    }

    addBoss() {
        if (this._opts.boss) {
            let boss = buildCreature(this._opts.boss, this._map.id)
            debugLog('FACTORY', `Seeding boss ${boss.name} in ${this._opts.id}`)
            this._seedEntity(boss)
        }
        return this
    }

    addLoot() {
        if (this._opts.loot) {
            this._opts.loot.forEach(item => {
                let { mat, id } = item
                let lt = buildEquip(id, mat, this._opts.id)
                debugLog('FACTORY', `Seeding guaranteed loot ${lt.name} in ${this._opts.id}`)
                this._seedEntity(lt)
            })
        }
        return this
    }

    seed(eType) {
        let params = {
            item: {
                min: this._opts.minItems || 0,
                max: this._opts.maxItems || 0,
                tags: this._opts.itemTags,
                createFn: randomItem,
            },
            equip: {
                min: this._opts.minEquips || 0,
                max: this._opts.maxEquips || 0,
                tags: this._opts.equipTags,
                createFn: randomEq,
            },
            creature: {
                min: this._opts.minCreatures || 0,
                max: this._opts.maxCreatures || 0,
                tags: this._opts.creatureTags,
                createFn: randomCreature,
            },
        }
        let p = params[eType]
        let minThings = p.min
        let maxThings = p.max
        let numThings = GameManager.RNG.getUniformInt(minThings, maxThings)
        for (let i = 0; i < numThings; i++) {
            let toAdd = p.createFn(p.tags, this._opts.id)
            debugLog('FACTORY', `Seeding ${eType} ${toAdd.name} in ${this._opts.id}`)
            this._seedEntity(toAdd)
        }
        return this
    }

    build() {
        this.seed('item')
            .seed('equip')
            .seed('creature')
            .addBoss()
            .addLoot()
        return this._map
    }
}

function buildCaves(opts = { width: 30, height: 30 }) {
    let gen = new Map.Cellular(opts.width || 30, opts.height || 30)
    return new MapBuilder(gen, opts, false).build()
}

function buildDigger(opts = { width: 30, height: 30 }) {
    let gen = new Map.Digger(opts.width, opts.height)
    return new MapBuilder(gen, opts, true).build()
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
                default:
                    return
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
                    let pt = null
                    if (matchingFloors.length > 0) {
                        pt = GameManager.RNG.getItem(matchingFloors)
                    }

                    connOpts = {
                        fromPt: pt || curMap.randomFloor(),
                        toPt: pt || toMap.randomFloor(),
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