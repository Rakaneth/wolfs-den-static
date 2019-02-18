<template>
  <div id="stats">
    <div class="lbl">{{ player.name }}</div>
    <div class="lbl">{{ player.gameMap.name }}</div>
    <div class="lbl">{{ player.pos }}</div>
    <div class="grid-container">
      <pri-stats :creature="player"></pri-stats>
      <sec-stats :creature="player"></sec-stats>
      <vitals :creature='player'></vitals>
    </div>
    <div id="inventory">Inventory
      <ul>
        <li v-for="thing in player.inventoryEntities" :key="thing.id" :class="{eq: thing.equipped}">
          {{ thing.name}}
          <span v-if="thing.equipped">({{ thing.slot}})</span>
          <button
            v-if="thing.has('equipment')"
            @click="toggleEquip(thing.id)"
          >{{ thing.equipped ? 'Unequip' : 'Equip' }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PriStats from "./pristats";
import SecStats from "./secstats";
import Vitals from './vitals';
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
  methods: {
    toggleEquip(eID) {
      let thing = this.gameState.entityByID(eID);
      if (thing.equipped) {
        this.player.dequip(eID);
      } else {
        this.player.equip(eID);
      }
    }
  },
  components: {
    PriStats,
    SecStats,
    Vitals
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

.eq {
  font-weight: bold;
  color: crimson;
}

#inventory {
  margin: 1em;
}

.lbl {
  color: yellow;
  font-weight: bold;
}
</style>


