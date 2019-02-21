import GameEventManager from "./dispatcher";
import GameManager from './gamestate'
import { debugLog } from './utils'
import App from './views/app.vue'
import { KEYS, DIRS } from 'rot-js'
import { testDice } from './dice'

GameEventManager.on('handle-key', (keyCode, shiftDown) => {
    debugLog('HANDLE-KEYS', `Keycode ${keyCode} pressed.${(shiftDown ? ' Shift is down.' : '')}`)
})

GameEventManager.on('handle-key', (keyCode, shiftDown) => {
    let player = GameManager.player
    let moves = {
        [KEYS.VK_NUMPAD8]: DIRS[8][0],
        [KEYS.VK_NUMPAD9]: DIRS[8][1],
        [KEYS.VK_NUMPAD6]: DIRS[8][2],
        [KEYS.VK_NUMPAD3]: DIRS[8][3],
        [KEYS.VK_NUMPAD2]: DIRS[8][4],
        [KEYS.VK_NUMPAD1]: DIRS[8][5],
        [KEYS.VK_NUMPAD4]: DIRS[8][6],
        [KEYS.VK_NUMPAD7]: DIRS[8][7],
    }
    if (moves.hasOwnProperty(keyCode)) {
        let [dx, dy] = moves[keyCode]
        GameEventManager.dispatch('try-move', GameManager.player, dx, dy)
    } else {
        switch (keyCode) {
            case KEYS.VK_COMMA:
                GameEventManager.dispatch('loot-square', player, player.pos)
                break;
            case KEYS.VK_T:
                console.log(testDice())
                break;
            default:
            //TODO: add other keybinds
            //do nothing
        }
    }
})