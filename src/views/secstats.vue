<template>
  <div class="grid-container" id="sec-stats">
    <div>Strength</div>
    <div>{{creature.getStat('atp')}}</div>
    <div>Defense</div>
    <div>{{creature.getStat('dfp')}}</div>
    <div>Damage</div>
    <div>{{creature.getStat('dmg')}}</div>
    <div>Toughness</div>
    <div>{{creature.getStat('tou')}}</div>
    <div>Resistance</div>
    <div>{{creature.getStat('res')}}</div>
    <div>Will</div>
    <div>{{creature.getStat('wil')}}</div>
    <div>Power</div>
    <div>{{creature.getStat('pwr')}}</div>
  </div>
</template>

<script>
export default {
  name: "sec-stats",
  props: {
    creature: Object
  }
};
</script>

<style>
#sec-stats > div:nth-child(odd) {
  color: yellow;
  font-weight: bold;
  text-align: right;
  margin-right: 10px;
}
</style>