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
    init(opts) {
        this.mapID = opts.mapID || "none"
        this.pos = opts.pos || null
    },
    get gameMap() {
        return GameManager.mapByID(this.mapID)
    }
})
export let Drawable = new Mixin('drawable', 'drawable', {
    init(opts) {
        this.glyph = opts.glyph || '@'
        this.color = opts.color || 'white'
        this.layer = opts.layer || 1
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
                    toAdd = this.getBonus('str')
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
    },
    getBonus(stat) {
        return Math.floor(this.getStat(stat) / 10)
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
        return this.allEquipped.reduce((total, nxt) => {
            return total + nxt[stat]
        }, 0)
    },
    get allEquipped() {
        if (this.has('inventory')) {
            return this.inventoryEntities.filter(el => el.equipped)
        } else {
            return []
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
                    toAdd = this.getBonus('str')
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
    },
    getBonus(stat) {
        return Math.floor(this.getStat(stat) / 10)
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
            this.whenIsPlayer(() => {
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
            this.whenIsPlayer(() => {
                GameEventManager.dispatch('message', `Cannot pick up ${thing.displayString}`)
            })
        }
    },
    drop(itemOrEID) {
        let thing = typeof (itemOrEID) === 'string' ? GameManager.entityByID(itemOrEID) : itemOrEID
        this.whenIsPlayer(() => {
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
    },
    get inventoryEntities() {
        return this.inventory.map(el => GameManager.entityByID(el))
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

export let Projectile = new Mixin('projectile', 'actor', {
    init(opts) {
        this.flightPath = opts.flightPath
        this.payload = opts.payload || {}
        this.spd = opts.spd || 10
    },
    getSpeed() {
        return this.spd
    },
    act() {
        let nxt = this.flightPath.shift()
        let thing = GameManager.getOccupyingEntity(nxt)
        if (thing) {
            GameEventManager.dispatch('projectile-hit', this, thing, nxt)
        } else if (!this.flightPath.length) {
            GameEventManager.dispatch('projectile-hit', null, nxt)
        } else {
            this.move(nxt)
        }
    }
})

export let Vitals = new Mixin('vitals', 'vita;s', {
    init(opts) {
        this.alive = true
        this.exhausted = false
        this.vit = 0
        this.edr = 0
        this.edrMult = opts.edrMult || 2
        this.vitMult = opts.vitMult || 1
    },
    get maxEdr() {
        return this.getStat('stam') * this.edrMult
    },
    get maxVit() {
        return this.getStat('stam') * this.vitMult
    },
    heal() {
        this.vit = this.maxVit
    },
    restore() {
        this.edr = this.maxEdr
    },
    changeVit(amt) {
        this.vit -= amt
        if (this.vit < 0) {
            this.alive = false
        }
    },
    changeEdr(amt) {
        this.edr = Math.max(this.edr - amt, 0)
        if (this.edr == 0) {
            this.exhausted = true
        }
    }
})

export let Food = new Mixin('food', 'consumable', {
    init(opts) {
        this.amt = opts.amt
    }
})

export let Healing = new Mixin('healing', 'consumable', {
    init(opts) {
        this.amt = opts.amt
    }
})

export let Vision = new Mixin('vision', 'vision', {
    init(opts) {
        this.vision = opts.vision || 6
        this.inView = []
    }
})

export let PlayerActor = new Mixin('player-actor', 'actor', {
    getSpeed() {
        return this.getStat('spd')
    },
    act() {
        //this.updateFOV()
        //GameManager.pause()
    }
})


