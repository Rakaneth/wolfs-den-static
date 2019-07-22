<template>
  <div id="inventory">
    Inventory {{player.inventoryEntities.length}} / {{player.capacity}}
    <ul>
      <li v-for="thing in player.inventoryEntities" :key="thing.id" :class="{eq: thing.equipped}">
        {{ thing.name}}
        <span v-if="thing.equipped">({{ thing.slot}})</span>
        <button
          v-if="thing.has('equipment')"
          @click="toggleEquip(thing.id)"
        >{{ thing.equipped ? 'Unequip' : 'Equip' }}</button>
        <button v-if="thing.has('consumable')" @click="use(thing.id)">Use</button>
        <button @click="drop(thing.id)">Drop</button>
      </li>
    </ul>
  </div>
</template>

<script>
import GameEventManager from "../dispatcher";
export default {
  name: "inventory",
  props: {
    gameState: Object
  },
  methods: {
    toggleEquip(eID) {
      let thing = this.gameState.entityByID(eID);
      if (thing.equipped) {
        this.player.dequip(eID);
      } else {
        this.player.equip(eID);
      }
    },
    use(eID) {
      let thing = this.gameState.entityByID(eID);
      thing.consume(this.player);
    },
    drop(eID) {
        this.player.drop(eID)
    }
  },
  computed: {
    player() {
      return this.gameState.player;
    }
  }
};
</script>

<style scoped>
.eq {
  font-weight: bold;
  color: crimson;
}

#inventory {
  padding: 1em;
}
</style>


    
