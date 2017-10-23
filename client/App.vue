<template>
  <div :class="$style.main">
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">NMIBP web</h2>
    </md-toolbar>

    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Menu</h3>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <router-link exact :to="'/add'">
            <md-icon>note_add</md-icon> <span>Add</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link exact :to="'/search'">
            <md-icon>search</md-icon> <span>Search</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link exact :to="'/analisys'">
            <md-icon>timeline</md-icon> <span>Analisys</span>
          </router-link>
        </md-list-item>
      </md-list>

    </md-sidenav>
    <div :class="$style.content">
      <router-view></router-view>
    </div>
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
    },

    methods: {
       toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      }
    }
  };
</script>

<style lang="scss" module>
  .main {
    min-height: 100vh;
  }
</style>