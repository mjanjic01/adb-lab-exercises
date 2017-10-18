<template>
  <div>
    <daterange-picker @filter:update="dateFilterUpdate"/>
  </div>
</template>

<script>
  import DaterangePicker from 'components/DaterangePicker.vue';

  export default {
    components: {
      DaterangePicker
    },

    data() {
      return {
      };

    },

    computed: {
    },

    methods: {
      dateFilterUpdate(dateInterval) {
        console.log(dateInterval);
      }
    }
  };
</script>

<style lang="scss">
</style>