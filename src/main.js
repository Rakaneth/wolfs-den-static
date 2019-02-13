import Vue from 'vue'
import App from './views/app'
import GameManager from './gamestate'
import Entity from './entity'
import { Drawable, PrimaryStats, Player, Mover, Position, EquipWearer, Inventory, Blocker, MoneyTaker, Equipment, Carryable, MoneyDrop } from './mixin'
import GameEventManager from './dispatcher';
import './gameevents'
import { buildEquip } from './factory';

let playerOpts = {
    name: 'player',
    mixins: [
        Drawable,
        Mover,
        PrimaryStats,
        Player,
        Blocker,
        Position,
        EquipWearer,
        Inventory,
        MoneyTaker
    ],
    tags: new Set(['player'])
}

let sampleItem = buildEquip('sword', 'iron')

let sampleMoney = new Entity({
    name: 'coins',
    mixins: [
        MoneyDrop
    ],
    minCoins: 10,
    maxCoins: 20
})
let player = new Entity(playerOpts)
GameManager.addEntity(player)
GameManager.addEntity(sampleItem)
GameManager.addEntity(sampleMoney)
player.pickUp(sampleItem)
player.pickUp(sampleMoney)
let MainComponent = Vue.extend(App)
new MainComponent().$mount('#gui')

