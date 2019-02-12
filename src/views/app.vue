<template>
  <div class="game-ui">
    <div ref="canvas"></div>
    <player-stats :gameState="gameState"></player-stats>
    <messages :messages="gameState.messages"></messages>
  </div>
</template>

<script>
import Messages from "./messages.vue";
import GameManager from "../gamestate";
import PlayerStats from "./stats.vue";
import { Display } from "rot-js";
export default {
  components: {
    Messages,
    PlayerStats
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
      gameState: GameManager
    };
  }
};
</script>

<style scoped>
.game-ui {
  display: grid;
  grid-template-columns: auto auto;
}
</style>

