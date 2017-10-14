<template>
  <div :class="$style.main">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    components: {
    },

    computed: {
    },

    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  .main {
    min-height: 100vh;
    background-color: '#FFFFFF';
  }
</style>