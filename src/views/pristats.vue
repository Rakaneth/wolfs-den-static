<template>
  <div class="grid-container" id="pri-stats">
    <div>Strength</div>
    <div>{{creature.getStat('str')}}</div>
    <div>Stamina</div>
    <div>{{creature.getStat('stam')}}</div>
    <div>Speed</div>
    <div>{{creature.getStat('spd')}}</div>
    <div>Skill</div>
    <div>{{creature.getStat('skl')}}</div>
    <div>Sagacity</div>
    <div>{{creature.getStat('sag')}}</div>
    <div>Smarts</div>
    <div>{{creature.getStat('smt')}}</div>
  </div>
</template>

<script>
export default {
  name: "pri-stats",
  props: {
    creature: Object
  }
};
</script>

<style>
#pri-stats > div:nth-child(odd) {
  color: yellow;
  font-weight: bold;
  text-align: right;
  margin-right: 10px;
}
</style>

