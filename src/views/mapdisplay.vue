<template>
  <div id="canvas" ref="canvas" @mapevent="drawMap"></div>
</template>

<script>
import { Display } from "rot-js";
import Tiles from "../tile.js";
import { between } from "../utils.js";
import Point from "../point.js";
export default {
  name: "map-display",
  props: {
    gameState: Object
  },
  data: function() {
    return {
      display: null,
      mapW: 60,
      mapH: 40
    };
  },
  mounted() {
    let canvas = this.$refs.canvas;
    let w = this.mapW;
    let h = this.mapH;
    let opts = {
      width: w,
      height: h,
      fontSize: 16,
      fontFamily: "droid sans mono",
      spacing: 1.0
    };
    this.display = new Display(opts);
    canvas.appendChild(this.display.getContainer());
    this.drawMap();
  },
  methods: {
    drawMap() {
      let curMap = this.gameState.curMap;
      if (curMap.dirty) {
        let player = this.gameState.player;
        let c = curMap.cam(player.pos, this.mapW, this.mapH);
        let w = c.x + this.mapW;
        let h = c.y + this.mapH;
        for (let wx = c.x; wx < w; wx++) {
          for (let wy = c.y; wy < h; wy++) {
            let worldPt = new Point(wx, wy);
            let sx = wx - c.x;
            let sy = wy - c.y;
            let t = curMap.getTile(worldPt);
            if (t !== Tiles["null-tile"]) {
              let fg = t.color;
              let bg = t.bg || (t.walk ? curMap.floorColor : curMap.wallColor);
              this.display.draw(sx, sy, t.display, fg, bg);
            }
          }
        }
        this.gameState.toDraw.forEach(en => {
          let pos = en.pos;
          let inLeft = between(pos.x, c.x, w);
          let inTop = between(pos.y, c.y, h);
          if (inLeft && inTop) {
            this.display.draw(
              pos.x - c.x,
              pos.y - c.y,
              en.glyph,
              en.color,
              curMap.floorColor
            );
          }
        });
        curMap.dirty = false;
      }
    }
  }
};
</script>



