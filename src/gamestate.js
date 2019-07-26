import { Scheduler, Engine, RNG } from 'rot-js'
import GameEventManager from './dispatcher'
import { debugLog } from './utils';

class GameState {
    constructor(rngSeed = null) {
        this.maps = {}
        this.entities = {}
        this.scheduler = new Scheduler.Speed()
        this.engine = new Engine(this.scheduler)
        this.curMapID = "none"
        this.messages = []
        this.RNG = RNG
        this.gameLoadPct = 0
        if (rngSeed) {
            this.RNG.setSeed(rngSeed)
        }
    }

    get player() {
        return Object.values(this.entities).find(el => el.has('player'))
    }

    get curMap() {
        return this.maps[this.curMapID]
    }

    setCurMap(value) {
        this.curMapID = value
        this.scheduler.clear()
        Object.values(this.entities).forEach(en => {
            en.whenHas('actor', () => {
                if (this.isHere(en)) {
                    this.schedule(en)
                }
            })
        })
    }

    addEntity(entity) {
        this.entities[entity.id] = entity
        GameEventManager.dispatch('add-entity', entity)
        entity.whenHas('actor', () => {
            if (this.isHere(entity)) {
                this.schedule(entity)
            }
        })
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

    thingsAt(pt, mapID = this.curMapID) {
        return this.entitiesOnMap(mapID).filter(en => {
            return en.pos && en.pos.same(pt) && mapID === en.mapID
        })
    }

    isEntityAt(entity, pt) {
        return this.thingsAt(pt).includes(entity)
    }

    isHere(entity) {
        return entity.has('position') && entity.mapID === this.curMapID && !!entity.pos
    }

    isBlocked(pt, mapID = this.curMapID) {
        return this.thingsAt(pt, mapID).some(el => el.has('blocker') && mapID === el.mapID)
    }

    getOccupyingEntity(pt, mapID = this.curMapID) {
        return this.thingsAt(pt, mapID).find(en => en.has('blocker'))
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
        debugLog('SCHEDULER', `${entity} scheduled`)
    }

    unschedule(entity) {
        if (entity.has('actor') && this.scheduler.getTimeOf(entity)) {
            debugLog('SCHEDULER', `${entity} unscheduled`)
        }
        this.scheduler.remove(entity)
    }

    entitiesOnMap(mapID) {
        return Object.values(this.entities).filter(en => mapID === en.mapID)
    }

    get curEntities() {
        return this.entitiesOnMap(this.curMapID)
    }

    get curActors() {
        return this.curEntities.filter(en => en.has('actor'))
    }

    get toDraw() {
        return this.curEntities.filter(en => en.has('drawable') && !!en.pos && this.player.canSee(en)).sort((fst, snd) => fst.layer - snd.layer)
    }

    get clock() {
        return this.scheduler.getTime()
    }

    inPlayerView(entity) {
        return this.player.canSee(entity)
    }

    get thingsInView() {
        return this.curEntities.filter(en => this.inPlayerView(en) && !en.has('player'))
    }


}

let GameManager = new GameState(0xDEADBEEF)
export default GameManager