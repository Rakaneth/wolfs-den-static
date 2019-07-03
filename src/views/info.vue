<template>
  <div id="seen">
    <ul>
      <li v-for="thing in seen" :key="thing.id" v-html="thing.displayString"></li>
    </ul>
  </div>
</template>

<script>
import { debugLog } from "../utils";
export default {
  name: "things-seen-info",
  props: {
    seen: Array
  }
};
</script>

<style scoped>
#seen {
  border: 1px solid red;
}
</style>

