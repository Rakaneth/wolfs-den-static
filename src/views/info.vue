<template>
  <div>
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
