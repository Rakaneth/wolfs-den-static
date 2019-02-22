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
    return clamp(val, low, high) == val
}

export function decorate(text, color) {
    return `<span style='color:${color};'>${text}</span>`
}

export function listRemove(list, val) {
    if (list.indexOf(val) > -1) {
        return list.filter(el => el !== val)
    } else {
        return list
    }
}

export function debugLog(tag, text) {
    console.log(`[${tag}] ${text}`)
}

export function deepClone(o) {
    let out, v, k
    out = Array.isArray(o) ? [] : {}
    for (k in o) {
        let desc = Object.getOwnPropertyDescriptor(o, k)
        if (desc.get) {
            Object.defineProperty(out, k, desc)
        } else {
            v = o[k]
            out[k] = (typeof (v) === 'object' && v !== null) ? deepClone(v) : v
        }
    }
    return out
}