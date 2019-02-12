import uuid from 'uuid/v4'
import GameManager from './gamestate'
import { decorate } from './utils';
import { callbackify } from 'util';

export default class Entity {
    constructor(name, opts = { mixins: [], tags: new Set() }) {
        this.mixins = new Set()
        this.groups = new Set()
        this.tags = opts.tags
        this.name = name
        this.id = uuid()
        opts.mixins.forEach(mixin => {
            Object.entries(mixin).forEach((k, v) => {
                if (!(k === 'name' || k === 'init' || k === 'group')) {
                    if (!this[k]) {
                        this[k] = v
                    }
                }
                if (mixin.init) {
                    mixin.init(this, opts)
                }
                this.mixins.add(mixin.name)
                this.mixins.add(mixin.group)
            })
        })
    }

    get gameMap() {
        if (this.has('position')) {
            return GameManager.mapByID(this.mapID)
        } else {
            return null
        }
    }

    get displayString() {
        if (this.has('drawable')) {
            return decorate(this.name, this.color)
        } else {
            return this.name
        }
    }

    has(mixinName) {
        return this.mixins.has(mixinName) || this.groups.has(mixinName)
    }

    whenHas(mixinName, calbak) {
        if (this.has(mixinName)) {
            calbak(this)
        }
    }

    getStat(stat) {
        let base = this[stat] || 0
        if (this.has('inventory')) {
            return base + this.getTotalEquipped(stat)
        } else {
            return base
        }
    }


}