<template>
  <div id="stats">
    <div class="lbl">{{ player.name }}</div>
    <div class="lbl">{{ player.desc }}</div>
    <div class="lbl">{{ player.gameMap.name }}</div>
    <div class="lbl">{{ player.pos }}</div>
    <div class="lbl">{{ player.money }} nits </div>
    <div class="grid-container">
      <pri-stats :creature="player"></pri-stats>
      <sec-stats :creature="player"></sec-stats>
      <vitals :creature="player"></vitals>
    </div>
    <inventory :gameState="gameState"></inventory>
  </div>
</template>

<script>
import PriStats from "./pristats";
import SecStats from "./secstats";
import Vitals from "./vitals";
import Inventory from "./inventory";
export default {
  name: "player-stats",
  props: {
    gameState: Object
  },
  computed: {
    player() {
      return this.gameState.player;
    }
  },
  components: {
    PriStats,
    SecStats,
    Vitals,
    Inventory
  }
};
</script>

<style scoped>
#stats {
  border: 1px solid red;
}

button {
  display: inline;
}

.lbl {
  color: yellow;
  font-weight: bold;
}
</style>


