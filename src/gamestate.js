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
        this.curEntities.forEach(en => {
            if (this.isHere(en) && en.has('actor')) {
                this.schedule(en)
            } else {
                this.unschedule(en)
            }
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

    thingsAt(pt) {
        return Object.values(this.curEntities)
            .filter(en => {
                return en.pos.same(pt) && this.isHere(en)
            })
    }

    isEntityAt(entity, pt) {
        return this.thingsAt(pt).includes(entity)
    }

    isHere(entity) {
        return entity.has('position') && entity.mapID === this.curMapID && !!entity.pos
    }

    isBlocked(pt) {
        return this.thingsAt(pt).some(el => el.has('blocker') && this.isHere(el))
    }

    getOccupyingEntity(pt) {
        return this.thingsAt(pt).find(en => en.has('blocker'))
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

    get curEntities() {
        return Object.values(this.entities).filter(en => this.isHere(en))
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