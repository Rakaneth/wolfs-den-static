class DispatchEvent {
    constructor(name) {
        this.name = name
        this.calbaks = []
    }

    register(cb) {
        this.calbaks.push(cb)
    }

    unregister(cb) {
        this.calbaks = this.calbaks.filter(el => el !== cb)
    }

    fire(...args) {
        const cbs = this.calbaks.slice(0)
        cbs.forEach(cb => {
            cb.apply(null, args)
        })
    }
}

class Dispatcher {
    constructor() {
        this.events = {}
    }

    on(eventName, calbak) {
        let ev = this.events[eventName]
        if (!ev) {
            ev = new DispatchEvent(eventName)
            this.events[eventName] = ev
        }
        ev.register(calbak)
    }

    dispatch(eventName, ...args) {
        const ev = this.events[eventName]
        if (ev) {
            ev.fire(...args)
        }
    }
}

let GameEventManager = new Dispatcher()
export default GameEventManager