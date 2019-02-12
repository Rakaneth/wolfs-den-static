<template>
  <div id="messages">
    <ul>
      <li v-for="(msg, idx) in messages.slice().reverse()" :key="idx">{{ msg }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "msg-display",
  props: {
    messages: Array
  }
};
</script>

<style scoped lang='css'>
#messages {
  height: 20vw;
  font-size: 16px;
  border: 1px solid red;
  width: 28vw;
  overflow-y: scroll;
}
</style>





