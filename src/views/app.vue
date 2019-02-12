<template>
  <div>
    <div ref="canvas"></div>
    <messages :messages="messages"></messages>
  </div>
</template>

<script>
import Messages from "./messages.vue";
import GameManager from "../gamestate";
import { Display } from "rot-js";
export default {
  components: {
    Messages
  },
  mounted() {
    let canvas = this.$refs.canvas;
    let opts = {
      width: 60,
      height: 40
    };
    let display = new Display(opts);
    canvas.appendChild(display.getContainer());
    display.drawText(0, 0, "Hello Vue and ROT.js!");
  },
  data() {
    return {
      messages: GameManager.messages,
      player: GameManager.player
    };
  }
};
</script>

