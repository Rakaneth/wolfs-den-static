import Point from './point'

class Mixin {
    constructor(name, group, data = {}) {
        this.name = name
        this.group = group
        Object.entries(data).forEach((k, v) => {
            this[k] = v
        })
    }
}

export let Position = new Mixin('position', 'position', { pos: new Point(0, 0) })
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
        if (this.has('position')) {
            this.pos = this.pos.translate(dx, dy)
        }
    },
    tryMove(pt, gameMap) {
        if (gameMap.walkable(pt)) {
            this.move(pt)
        }
    },
    tryMoveBy(dx, dy) {
        let pt = this.pos.translate(dx, dy)
        if (gameMap.walkable(pt)) {
            this.move(pt)
        }
    }
})
