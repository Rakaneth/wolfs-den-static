import { Scheduler, Engine } from 'rot-js'

class GameState {
    constructor() {
        this.maps = {}
        this.entities = {}
        this.scheduler = new Scheduler.Speed()
        this.engine = new Engine(this.scheduler)
        this.curMapID = "none"
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

    byID(eID) {
        return this.entities[eID]
    }

    thingsAt(pt) {
        return Object.values(this.entities).filter(en => en.has('position') && en.position.same(pt))
    }

    isEntityAt(entity, pt) {
        return this.thingsAt(pt).includes(entity)
    }

    isBlocked(pt) {
        return this.thingsAt(pt).some(el => el.has('blocker'))
    }
}