import uuid from 'uuid/v4'
import GameManager from './gamestate'
import { decorate } from './utils';

export default class Entity {
    constructor(opts = { mixins: [], tags: new Set() }) {
        this.mixins = new Set()
        this.groups = new Set()
        this.tags = opts.tags || new Set()
        this.name = opts.name || 'No name'
        this.id = uuid()
        opts.mixins.forEach(mixin => {
            for (let prop in mixin) {
                if (!(prop === 'init' || prop === 'name' || prop === 'group' || this.hasOwnProperty(prop))) {
                    let propDesc = Object.getOwnPropertyDescriptor(mixin, prop)
                    if (propDesc.get) {
                        Object.defineProperty(this, prop, propDesc)
                    } else {
                        this[prop] = mixin[prop]
                    }
                }
            }
            this.mixins.add(mixin.name)
            this.groups.add(mixin.group)
            if (mixin.init) {
                mixin.init.call(this, opts)
            }
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
}