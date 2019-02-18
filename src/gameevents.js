import GameEventManager from './dispatcher'
import GameManager from './gamestate'
import { listRemove } from './utils';

GameEventManager.on('pickup', (entity, item) => {
    item.whenHas('money-drop', () => {
        entity.whenHas('money-taker', () => {
            entity.money = (entity.money || 0) + item.amt
            entity.removeInventory(item.id)
            GameManager.removeEntity(item)
            entity.whenIsPlayer(() => GameManager.unpause())
        })
    })
})

GameEventManager.on('message', (msg) => {
    GameManager.messages.push(msg)
})

GameEventManager.on('try-move', (entity, dx, dy) => {
    let dest = entity.pos.translate(dx, dy)
    let thing = GameManager.getOccupyingEntity(dest)
    if (thing) {
        GameEventManager.dispatch('interact', entity, thing)
    } else if (entity.gameMap.isWalkable(dest)) {
        entity.move(dest)
        entity.gameMap.dirty = true
        entity.whenIsPlayer(() => GameManager.unpause())
    }
})

GameEventManager.on('loot-square', (entity, pt) => {
    let loot = GameManager.thingsAt(pt).filter(en => en.has('carryable'))
    entity.whenHas('inventory', () => {
        loot.forEach(thing => entity.pickUp(thing))
    })
})

GameEventManager.on('used-item', (user, consumed) => {
    let msg = consumed.usedMessage
        .replace('<user>', user.displayString)
        .replace('<item>', consumed.displayString)
    if (consumed.uses && --consumed.uses == 0) {
        user.removeInventory(consumed.id)
        GameManager.removeEntity(consumed)
    }
    if (GameManager.inPlayerView(user)) {
        GameEventManager.dispatch('message', msg)
    }
})