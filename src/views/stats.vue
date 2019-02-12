<template>
  <div id="stats">
    <div>{{ player.name }}</div>
    <div>{{ player.mapID }}</div>
    <div>{{ player.pos }}</div>
    <div class="grid-container">
      <div>Strength {{ player.getStat('str') }}</div>
      <div>Damage {{ player.getStat('dmg') }}</div>
      <div>Stamina {{ player.getStat('stam') }}</div>
      <div>Toughness {{ player.getStat('tou')}}</div>
      <div>Speed {{ player.getStat('spd') }}</div>
      <div>Resistance {{ player.getStat('res')}}</div>
      <div>Skill {{ player.getStat('skl')}}</div>
      <div>Attack {{ player.getStat('atp')}}</div>
      <div>Sagacity {{ player.getStat('sag')}}</div>
      <div>Defense {{ player.getStat('dfp')}}</div>
      <div>Smarts {{ player.getStat('smt')}}</div>
      <div>Will {{ player.getStat('wil')}}</div>
      <div></div>
      <div>Power {{ player.getStat('pwr')}}</div>
    </div>
    <div>
      <ul>
        <li v-for="thing in gameState.entityByID(player.inventory)" :key="thing.id">{{ thing.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "player-stats",
  props: {
    gameState: Object
  },
  computed: {
    player() {
      return this.gameState.player;
    }
  }
};
</script>

<style scoped>
.grid-container {
  width: 28vw;
}

#stats {
  border: 1px solid red;
}
</style>


