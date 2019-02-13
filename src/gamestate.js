import { Scheduler, Engine, RNG } from 'rot-js'
import GameEventManager from './dispatcher'

class GameState {
    constructor(rngSeed = null) {
        this.maps = {}
        this.entities = {}
        this.scheduler = new Scheduler.Speed()
        this.engine = new Engine(this.scheduler)
        this.curMapID = "none"
        this.messages = []
        this.RNG = RNG
        if (rngSeed) {
            this.RNG.setSeed(rngSeed)
        }
    }

    get player() {
        return Object.values(this.entities).find(el => el.has('player'))
    }

    get curMap() {
        return this.maps[curMapID]
    }

    set curMap(value) {
        this.curMapID = value
    }

    addEntity(entity) {
        this.entities[entity.id] = entity
        GameEventManager.dispatch('add-entity', entity)
    }

    removeEntity(entity) {
        GameEventManager.dispatch('remove-entity', entity)
        this.unschedule(entity)
        delete this.entities[entity.id]
    }

    entityByID(eID) {
        return this.entities[eID]
    }

    mapByID(mID) {
        return this.maps[mID]
    }

    thingsAt(pt) {
        return Object.values(this.entities).filter(en => en.has('position') && en.position.same(pt) && en.mapID === this.curMapID)
    }

    isEntityAt(entity, pt) {
        return this.thingsAt(pt).includes(entity)
    }

    isBlocked(pt) {
        return this.thingsAt(pt).some(el => el.has('blocker'))
    }

    pause() {
        this.engine.lock()
    }

    start() {
        this.engine.start()
    }

    unpause() {
        this.engine.unlock()
    }

    schedule(entity) {
        this.scheduler.add(entity, true)
    }

    unschedule(entity) {
        this.scheduler.remove(entity)
    }
}

let GameManager = new GameState(0xDEADBEEF)
export default GameManager