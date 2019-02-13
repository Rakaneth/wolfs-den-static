import Point from './point'
import { PriStatNames, SecStatNames, listRemove, decorate } from './utils'
import GameManager from './gamestate'
import GameEventManager from './dispatcher'


class Mixin {
    constructor(name, group, data = {}) {
        this.name = name
        this.group = group
        for (let prop in data) {
            let propDesc = Object.getOwnPropertyDescriptor(data, prop)
            if (propDesc.get) {
                Object.defineProperty(this, prop, propDesc)
            } else {
                this[prop] = data[prop]
            }
        }
    }
}

export let Position = new Mixin('position', 'position', {
    pos: new Point(0, 0),
    mapID: "none",
    get gameMap() {
        return GameManager.mapByID(this.mapID)
    }
})
export let Drawable = new Mixin('drawable', 'drawable', {
    init(opts) {
        this.glyph = opts.glyph || '@'
        this.color = opts.color || 'white'
    },
    get displayString() {
        return decorate(this.name, this.color)
    }
})
export let Player = new Mixin('player', 'player')
export let Blocker = new Mixin('blocker', 'blocker')
export let Carryable = new Mixin('carryable', 'carryable')
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
    init(opts) {
        PriStatNames.forEach(stat => {
            this[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 10
        })
    }
})

export let Equipment = new Mixin('equipment', 'item', {
    init(opts) {
        SecStatNames.forEach(stat => {
            this[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 0
        })
        PriStatNames.forEach(stat => {
            this[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 0
        })
        this.equipped = false
        this.slot = opts.slot || "trinket"
        this.equipType = opts.equipType || "trinket"
        this.damageType = opts.damageType || "none"
        this.hardness = opts.hardness || 0
    }
})

export let DerivedStats = new Mixin('derived-stats', 'derived-stats', {
    getStat(stat) {
        let isPrimary = PriStatNames.includes(stat)
        let base = this[stat] || 0
        let toAdd = 0
        if (!isPrimary) {
            switch (stat) {
                case 'atp':
                    toAdd = this['skl'] || 0
                    break;
                case 'dfp':
                    toAdd = this['spd'] || 0
                    break;
                case 'tou':
                    toAdd = this['stam'] || 0
                    break;
                case 'dmg':
                    toAdd = this['str'] || 0
                    break;
                case 'res':
                    toAdd = Math.floor(((this['sag'] || 0) + (this['stam'] || 0)) / 2)
                    break;
                case 'wil':
                    toAdd = this['sag']
                    break;
                case 'pwr':
                    toAdd = this['smt']
                    break;
                default:
                    toAdd = 0
            }
        }
        return base + toAdd
    }
})

export let EquipWearer = new Mixin('equip-wearer', 'derived-stats', {
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
    },
    getTotalEquipped(stat) {
        if (this.has('inventory')) {
            let things = this.inventory.map(el => GameManager.entityByID(el))
            let eqs = things.filter(el => el.has('equipment') && el.equipped)
            return eqs.reduce((total, eq) => total + (eq[stat] || 0), 0)
        } else {
            return 0
        }
    },
    getStat(stat) {
        let isPrimary = PriStatNames.includes(stat)
        let base = this[stat] || 0
        let toAdd = 0
        if (!isPrimary) {
            switch (stat) {
                case 'atp':
                    toAdd = this['skl'] || 0
                    break;
                case 'dfp':
                    toAdd = this['spd'] || 0
                    break;
                case 'tou':
                    toAdd = this['stam'] || 0
                    break;
                case 'dmg':
                    toAdd = this['str'] || 0
                    break;
                case 'res':
                    toAdd = Math.floor(((this['sag'] || 0) + (this['stam'] || 0)) / 2)
                    break;
                case 'wil':
                    toAdd = this['sag']
                    break;
                case 'pwr':
                    toAdd = this['smt']
                    break;
                default:
                    toAdd = 0
            }
        }
        return base + toAdd + this.getTotalEquipped(stat)
    }
})

export let Inventory = new Mixin('inventory', 'inventory', {
    init(opts) {
        this.inventory = []
        this.capacity = opts.capacity || 2
    },
    addInventory(eID) {
        this.inventory.push(eID)
    },
    removeInventory(eID) {
        this.inventory = listRemove(this.inventory, eID)
    },
    pickUp(itemOrEID) {
        let thing = typeof (itemOrEID) === 'string' ? GameManager.entityByID(itemOrEID) : itemOrEID
        if (this.bagsFull) {
            whenIsPlayer(this, () => {
                let msg = `Bags are full; cannot pick up ${thing.displayString}`
                GameEventManager.dispatch('message', msg)
            })
        } else if (thing.has('carryable') || thing.has('money-drop')) {
            thing.whenHas('position', () => {
                thing.pos = null
                thing.mapID = null
            })
            this.addInventory(thing.id)
            GameEventManager.dispatch('pickup', this, thing)
        } else {
            whenIsPlayer(this, () => {
                GameEventManager.dispatch('message', `Cannot pick up ${thing.displayString}`)
            })
        }
    },
    drop(itemOrEID) {
        let thing = typeof (itemOrEID) === 'string' ? GameManager.entityByID(itemOrEID) : itemOrEID
        whenIsPlayer(this, () => {
            let msg = `Dropped ${thing.displayString}`
            GameEventManager.dispatch('message', msg)
        })
        this.removeInventory(thing.id)
        thing.mapID = this.mapID
        thing.pos = this.pos
        GameEventManager.dispatch('drop', this, thing)
    },
    get bagsFull() {
        return this.inventory.length >= this.capacity
    }
})

export let MoneyDrop = new Mixin('money-drop', 'money-drop', {
    init(opts) {
        this.amt = GameManager.RNG.getUniformInt(opts.minCoins, opts.maxCoins)
    }
})

export let MoneyTaker = new Mixin('money-taker', 'money-taker', {
    init(opts) {
        this.money = opts.money || 0
    },
    get displayMoney() {
        return `${this.money}`
    }
})

export function whenIsPlayer(entity, calbak) {
    entity.whenHas('player', calbak)
}
