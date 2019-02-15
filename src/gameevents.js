import GameEventManager from './dispatcher'
import GameManager from './gamestate'
import { listRemove } from './utils';

GameEventManager.on('pickup', (entity, item) => {
    item.whenHas('money-drop', () => {
        entity.whenHas('money-taker', () => {
            entity.money = (entity.money || 0) + item.amt
            entity.removeInventory(item.id)
            GameManager.removeEntity(item)
            //entity.whenIsPlayer(() => GameManager.unpause())
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
        //entity.whenIsPlayer(() => GameManager.unpause())
    }
})