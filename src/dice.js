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
    let roll = GameManager.RNG.getPercentage()
    let result = (base + diff) - roll
    return { passed: result >= 0, margin: Math.abs(result), diff, base, roll }
}

export function rollDamage(dmg) {
    return Math.floor(GameManager.RNG.getNormal(dmg, 2.5))
}

export function testDice() {
    let results = { toHit: [], dmg: [], report: {} }
    let diffs = Object.values(Difficulty)
    diffs.forEach(diff => {
        for (let i = 0; i < 10; i++) {
            results.toHit.push(diceCheck(10, diff))
        }
    })
    for (let j = 0; j < 100; j++) {
        results.dmg.push(rollDamage(10))
    }
    results.report.minDmg = Math.min(...results.dmg)
    results.report.maxDmg = Math.max(...results.dmg)
    return results
}