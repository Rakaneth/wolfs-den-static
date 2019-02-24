<template>
  <div>
    <ul>
      <li v-for="thing in seen" :key="thing.id">{{thing.displayString}}</li>
    </ul>
  </div>
</template>

<script>
export default {
    name: 'things-seen-info',
    data() {
        return {
            seen: [],
        }
    },
    created() {
        this.$on('things-seen', (stuff) => this.seen = stuff)
    },
};
</script>
