import Point from './point'
import { PriStatNames, SecStatNames } from './utils'
import GameManager from './gamestate'
import GameEventManager from './dispatcher'
import { RNG } from 'rot-js';

class Mixin {
    constructor(name, group, data = {}) {
        this.name = name
        this.group = group
        Object.entries(data).forEach((k, v) => {
            this[k] = v
        })
    }
}

export let Position = new Mixin('position', 'position', {
    pos: new Point(0, 0),
    mapID: "none"
})
export let Drawable = new Mixin('drawable', 'drawable', {
    init(entity, opts) {
        entity.glyph = opts.glyph || '@'
        entity.color = opts.color || 'white'
    }
})
export let Player = new Mixin('player', 'player')
export let Blocker = new Mixin('blocker', 'blocker')
export let Mover = new Mixin('mover', 'mover', {
    move(pt) {
        if (this.has('position')) {
            this.pos = pt
        }
    },
    moveBy(dx, dy) {
        this.move(this.pos.translate(dx, dy))
    }
})

export let PrimaryStats = new Mixin('primary-stats', 'primary-stats', {
    init(entity, opts) {
        PriStatNames.forEach(stat => {
            entity[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 10
        })
    }
})

export let Equipment = new Mixin('equipment', 'secondary-stats', {
    init(entity, opts) {
        SecStatNames.forEach(stat => {
            entity[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 10
            entity.equipped = false
            entity.slot = opts.slot || "trinket"
        })
    }
})

export let EquipWearer = new Mixin('equip-wearer', 'equip-wearer', {
    equip(eID) {
        let eq = GameManager.entityByID(eID)
        if (eq.has('equipment')) {
            eq.equipped = true
        }
    },
    dequip(eID) {
        let eq = GameManager.entityByID(eID)
        if (eq.has('equipment')) {
            eq.equipped = false
        }
    }
})

export let Inventory = new Mixin('inventory', 'inventory', {
    init(entity, opts) {
        entity.inventory = opts.startInventory || []
        entity.capacity = opts.capacity || 2
    },
    pickUp(itemOrEID) {
        let thing = typeof (itemOrEID) === 'string' ? GameManager.entityByID(itemOrEID) : itemOrEID
        if (this.bagsFull) {
            whenIsPlayer(this, () => {
                let msg = `Bags are full; cannot pick up ${thing.displayString}`
                GameEventManager.dispatch('message', null, msg)
            })
        } else {
            thing.whenHas('position', () => {
                thing.pos = null
                thing.mapID = null
            })
            this.inventory.push(thing.id)
            GameEventManager.dispatch('pickup', this, thing)
        }
    },
    drop(itemOrEID) {
        let thing = typeof (itemOrEID) === 'string' ? GameManager.entityByID(itemOrEID) : itemOrEID
        whenIsPlayer(this, () => {
            let msg = `Dropped ${thing.displayString}`
            GameEventManager.dispatch('message', null, msg)
        })
        this.inventory = this.inventory.filter(el => el !== thing.id)
        thing.mapID = this.mapID
        thing.pos = this.pos
        GameEventManager.dispatch('drop', this, thing)
    },
    get bagsFull() {
        return this.inventory.length >= this.capacity
    }
})

export let Money = new Mixin('money', 'money', {
    init(entity, opts) {
        entity.amt = RNG.getUniformInt(opts.minCoins, opts.maxCoins)
    }
})

export function whenIsPlayer(entity, calbak) {
    entity.whenHas('player', calbak)
}
