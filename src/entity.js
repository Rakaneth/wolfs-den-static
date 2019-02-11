import uuid from 'uuid/v4'

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

    has(mixinName) {
        return this.mixins.has(mixinName) || this.groups.has(mixinName)
    }
}