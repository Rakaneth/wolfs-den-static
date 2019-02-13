export let PriStatNames = ['str', 'stam', 'spd', 'skl', 'sag', 'smt']
export let SecStatNames = ['atp', 'dfp', 'tou', 'res', 'dmg', 'wil', 'pwr']

export function clamp(val, low, high) {
    switch (true) {
        case val < low:
            return low
        case val > high:
            return high
        default:
            return val
    }
}

export function between(val, low, high) {
    return clamp(val, low, high)
}

export function decorate(text, color) {
    return `<span style='${color}'>${text}</span>`
}

export function listRemove(list, val) {
    return list.filter(el => el !== val)
}