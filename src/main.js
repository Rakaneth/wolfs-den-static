
let opts = {
    width: 50,
    height: 50
}
let disp = new ROT.Display(opts)
let canvas = document.getElementById('map-canvas')
canvas.appendChild(disp.getContainer())
disp.drawText(0, 0, "Hello, ROTJS!")
