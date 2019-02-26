import Points from './point'
import { PriStatNames, SecStatNames, listRemove, decorate, clamp } from './utils'
import GameManager from './gamestate'
import GameEventManager from './dispatcher'
import { timingSafeEqual } from 'crypto';
import { EquipSlots } from './equipslots'


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
export let DoorOpener = new Mixin('door-opener', 'door-opener')
export let CorpseLeaver = new Mixin('corpse-leaver', 'corpse-leaver')
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
        SecStatNames.forEach(stat => {
            this[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 0
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
    init(opts) {
        SecStatNames.forEach(stat => {
            this[stat] = typeof (opts[stat]) === 'number' ? opts[stat] : 0
        })
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
        return base + toAdd
    },
    getBonus(stat) {
        return Math.floor(this.getStat(stat) / 10)
    }
})

export let EquipWearer = new Mixin('equip-wearer', 'derived-stats', {
    equip(eID) {
        let eq = GameManager.entityByID(eID)
        this.allEquipped
            .filter(el => el.slot === eq.slot)
            .forEach(thing => thing.equipped = false)
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
                    let arm = this.getEquippedSlot(EquipSlots.ARMOR)
                    toAdd = (this['stam'] || 0) + (arm ? arm.hardness : 0)
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
    },
    getEquippedSlot(slot) {
        let eq = this.allEquipped.find(el => el.slot === slot)
        return eq
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
            if (GameManager.inPlayerView(this)) {
                GameEventManager.dispatch('message', `${this.displayString} picks up ${thing.displayString}`)
            }
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
        if (thing.equipped) {
            thing.equipped = false
        }
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
        this.amt = GameManager.RNG.getUniformInt(opts.minCoins || 0, opts.maxCoins || 0)
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
    takeAction() {
        let nxt = this.flightPath.shift()
        let thing = GameManager.getOccupyingEntity(nxt)
        if (thing) {
            GameEventManager.dispatch('projectile-hit', this, thing, nxt)
        } else if (!this.flightPath.length) {
            GameEventManager.dispatch('projectile-hit', this, null, nxt)
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
        return Math.floor(this.getStat('stam') * this.edrMult)
    },
    get maxVit() {
        return Math.floor(this.getStat('stam') * this.vitMult)
    },
    heal() {
        this.vit = this.maxVit
    },
    restore() {
        this.edr = this.maxEdr
    },
    changeVit(amt) {
        this.vit = Math.min(this.maxVit, amt + this.vit)
        if (this.vit < 0) {
            this.alive = false
        }
    },
    changeEdr(amt) {
        this.edr = clamp(this.edr + amt, 0, this.maxEdr)
        if (this.edr == 0) {
            this.exhausted = true
        }
    }
})

export let Food = new Mixin('food', 'consumable', {
    init(opts) {
        this.amt = opts.amt
        this.uses = opts.uses || 1
        this.usedMessage = opts.usedMessage || `<user> eats <item>.`
    },
    consume(user) {
        let amt = Math.floor(this.amt * user.maxEdr)
        user.changeEdr(amt)
        GameEventManager.dispatch('used-item', user, this)
    }
})

export let Healing = new Mixin('healing', 'consumable', {
    init(opts) {
        this.amt = opts.amt
        this.uses = opts.uses || 1
        this.usedMessage = opts.usedMessage || `<user> uses <item>.`
    },
    consume(user) {
        let amt = Math.floor(this.amt * user.maxEdr)
        user.changeVit(amt)
        GameEventManager.dispatch('used-item', user, this)
    }
})

export let Vision = new Mixin('vision', 'vision', {
    init(opts) {
        this.vision = opts.vision || 6
        this.inView = []
    },
    canSee(ptOrThing) {
        let pt = !!ptOrThing.pos ? ptOrThing.pos : ptOrThing
        return this.inView.some(el => el.same(pt))
    },
})

export let PlayerActor = new Mixin('player-actor', 'actor', {
    getSpeed() {
        return this.getStat('spd')
    },
    takeAction() {
        GameManager.pause()
    }
})

export let Faction = new Mixin('faction', 'faction', {
    init(opts) {
        this.enemies = opts.enemies ? new Set(opts.enemies) : new Set()
        this.allies = opts.allies ? new Set(opts.allies.concat(this.id)) : new Set([this.id])
    },
    isAlly(entity) {
        let otherTags = [...entity.tags]
        let myTags = [...this.tags]
        let otherSearch = otherTags.some(tag => this.allies.has(tag))
        let mySearch = myTags.some(tag => entity.allies && entity.allies.has(tag))
        return otherSearch || mySearch
    },
    isEnemy(entity) {
        let otherTags = [...entity.tags]
        let myTags = [...this.tags]
        let otherSearch = otherTags.some(tag => this.enemies.has(tag))
        let mySearch = myTags.some(tag => entity.enemies && entity.enemies.has(tag))
        return (otherSearch || mySearch) && !this.isAlly(entity)
    },
    isNeutral(entity) {
        return !(this.isAlly(entity) || this.isEnemy(entity))
    },
    makeAlly(faction) {
        this.allies.add(faction)
        this.enemies.delete(faction)
    },
    makeEnemy(faction) {
        this.enemies.add(faction)
        this.allies.delete(faction)
    }
})


