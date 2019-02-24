<template>
  <div class="game-ui">
    <map-display :gameState="gameState" ref="mapDisplay"></map-display>
    <player-stats :gameState="gameState"></player-stats>
    <messages :messages="gameState.messages"></messages>
    <things-seen-info></things-seen-info>
  </div>
</template>

<script>
import Messages from "./messages.vue";
import GameManager from "../gamestate";
import PlayerStats from "./stats.vue";
import MapDisplay from "./mapdisplay.vue";
import ThingsSeenInfo from './info.vue';
import GameEventManager from "../dispatcher.js";
export default {
  components: {
    Messages,
    PlayerStats,
    MapDisplay,
    ThingsSeenInfo
  },
  data() {
    return {
      gameState: GameManager
    };
  },
  created() {
    window.addEventListener("keydown", e => {
      GameEventManager.dispatch("handle-key", e.keyCode, e.shiftKey);
      this.$refs.mapDisplay.drawMap();
    });
  }
};
</script>

<style scoped>
.game-ui {
  display: grid;
  grid-template-columns: auto auto;
}
</style>

