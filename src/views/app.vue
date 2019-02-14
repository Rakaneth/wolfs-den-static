<template>
  <div class="game-ui">
    <map-display :gameState="gameState"></map-display>
    <player-stats :gameState="gameState"></player-stats>
    <messages :messages="gameState.messages"></messages>
  </div>
</template>

<script>
import Messages from "./messages.vue";
import GameManager from "../gamestate";
import PlayerStats from "./stats.vue";
import MapDisplay from "./mapdisplay.vue";
export default {
  components: {
    Messages,
    PlayerStats,
    MapDisplay
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

