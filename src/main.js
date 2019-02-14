import Vue from 'vue'
import App from './views/app'
import GameManager from './gamestate'
import Entity from './entity'
import { Drawable, PrimaryStats, Player, Mover, Position, EquipWearer, Inventory, Blocker, MoneyTaker, Equipment, Carryable, MoneyDrop } from './mixin'
import GameEventManager from './dispatcher';
import './gameevents'
import './handlekeys'
import { buildAllMaps } from './factory';

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

buildAllMaps()


let player = new Entity(playerOpts)
player.mapID = 'mine-upper'
GameManager.setCurMap('mine-upper')
player.pos = GameManager.curMap.randomFloor()
GameManager.addEntity(player)
let MainComponent = Vue.extend(App)
new MainComponent().$mount('#gui')

