import GameManager from './gamestate'

export let Difficulty = {
    IMPOSSIBLE: 0,
    UNLIKELY: 10,
    HARD: 20,
    CHALLENGING: 30,
    EASY: 40,
    SIMPLE: 50
}

export function diceCheck(base, diff = Difficulty.SIMPLE) {
    let result = (base + diff) - GameManager.RNG.getPercentage()
    return { passed: result >= 0, margin: Math.abs(result) }
}