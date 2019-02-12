import GameEventManager from './dispatcher'
import GameManager from './gamestate'

GameEventManager.on('pickup', (entity, item) => {
    item.whenHas('money', () => {
        entity.money = (entity.money || 0) + item.amt
        GameManager.removeEntity(item)
    })
})

GameEventManager.on('message', (_, msg) => {
    GameManager.messages.push(msg)
})