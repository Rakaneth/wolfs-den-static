import Vue from 'vue'
import App from './views/app'
import GameManager from './gamestate'
import './gameevents'
import './handlekeys'
import { buildAllMaps, buildPlayer } from './factory';

buildAllMaps()
let player = buildPlayer('Oglebane', 'keldun', 'mine-upper')
player.pos = GameManager.curMap.randomFloor()
GameManager.start()
let MainComponent = Vue.extend(App)
new MainComponent().$mount('#gui')