export default class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    same(other) {
        return !!other && this.x == other.x && this.y == other.y
    }

    distance(other) {
        return Math.max(Math.abs(this.x - other.x), Math.abs(this.y - other.y))
    }

    adj(other) {
        return this.distance(other) == 1
    }

    translate(x, y) {
        return new Point(this.x + x, this.y + y)
    }

    toString() {
        return `${this.x},${this.y}`
    }
}