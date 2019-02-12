import GameEventManager from './dispatcher'
import GameManager from './gamestate'
import { listRemove } from './utils';

GameEventManager.on('pickup', (entity, item) => {
    item.whenHas('money-drop', () => {
        entity.whenHas('money-taker', () => {
            entity.money = (entity.money || 0) + item.amt
            entity.removeInventory(item.id)
            GameManager.removeEntity(item)
        })
    })
})

GameEventManager.on('message', (msg) => {
    GameManager.messages.push(msg)
})