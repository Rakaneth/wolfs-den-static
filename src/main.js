import Vue from 'vue'
import App from './views/app'
import GameManager from './gamestate'
import Entity from './entity'
import { Drawable, PrimaryStats, Player, Mover, Position, EquipWearer, Inventory, Blocker } from './mixin'

let playerOpts = {
    mixins: [
        Drawable,
        Mover,
        PrimaryStats,
        Player,
        Blocker,
        Position,
        EquipWearer,
        Inventory,
    ],
}
let player = new Entity('player', playerOpts)
GameManager.addEntity(player)
let MainComponent = Vue.extend(App)
new MainComponent().$mount('#gui')

