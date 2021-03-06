import GameEventManager from './dispatcher'
import GameManager from './gamestate'
import { listRemove, decorate, deepClone } from './utils';
import swatch from './swatch';
import { buildCorpse } from './factory'

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
    let moved = false
    if (thing) {
        GameEventManager.dispatch('interact', entity, thing)
        moved = true
    } else if (entity.gameMap.isWalkable(dest)) {
        entity.move(dest)
        moved = true
    } else if (entity.gameMap.isClosedDoor(dest) && entity.has('door-opener')) {
        entity.gameMap.setTile(dest, 'door-open')
        moved = true
    }
    entity.gameMap.dirty = moved
    if (moved) {
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
    user.whenIsPlayer(() => GameManager.unpause())
})

GameEventManager.on('interact', (giver, receiver) => {
    if (giver.has('faction') && giver.isEnemy(receiver)) {
        GameEventManager.dispatch('basic-attack', giver, receiver)
    } else {
        GameEventManager.dispatch('swap', giver, receiver)
    }
})

GameEventManager.on('swap', (mover, flipped) => {
    let mPos = mover.pos.clone()
    let fPos = flipped.pos.clone()
    mover.pos = fPos
    flipped.pos = mPos
    mover.gameMap.dirty = true
    mover.whenIsPlayer(() => GameManager.unpause())
})

GameEventManager.on('basic-attack', (attacker, defender) => {
    GameEventManager.dispatch('message', `${attacker.displayString} attacks ${defender.displayString}!`)
    defender.alive = false
    GameEventManager.dispatch('death', defender, attacker)
})

GameEventManager.on('death', (slain, killer) => {
    if (slain.onDeath) {
        GameEventManager.dispatch(slain.onDeath, slain, killer)
    }
    if (!slain.alive) {
        if (slain.has('player')) {
            //TODO: GAME OVER MAN
        } else {
            slain.whenHas('inventory', () => {
                slain.inventoryEntities.forEach(item => {
                    slain.drop(item)
                })
            })
            let visiName = (thing) => GameManager.inPlayerView(thing) ? thing.displayString : decorate("Nothing", swatch.cyan)
            if (GameManager.inPlayerView(slain) || GameManager.inPlayerView(killer)) {
                let visiSlain = visiName(slain)
                let visiKiller = visiName(killer)
                GameEventManager.dispatch('message', `${visiKiller} has slain ${visiSlain}!`)
            }
            slain.whenHas('corpse', () => {
                buildCorpse(slain)
            })
            GameManager.removeEntity(slain)
        }
    }
})

GameEventManager.on('eat-corpse-default', (eater, corpse) => {
    let canSeeEating = GameManager.inPlayerView(eater) || GameManager.inPlayerView(corpse)
    if (corpse.canBeEaten) {
        if (canSeeEating) {
            GameEventManager.dispatch('message', `${eater.displayString} devours the ${corpse.displayString}.`)
        }
        if (eater.has('inventory') && eater.hasItem(corpse)) {
            eater.removeInventory(corpse.id)
        }
        GameManager.removeEntity(corpse)
    }
})

GameEventManager.on('change-level', (conn) => {
    let player = GameManager.player
    player.pos = conn.toPt
    player.mapID = conn.mapID
    GameManager.setCurMap(conn.mapID)
    player.gameMap.dirty = true
    GameManager.unpause()
})