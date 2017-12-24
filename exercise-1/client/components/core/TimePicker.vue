
<template>
  <div>
    <md-input-container>
      <label for="timepicker">{{label}}</label>
      <md-select name="timepicker" :value="hour" @change="onSelected">
        <md-option
          v-for="hour in range"
          :key="hour"
          :value="hour"
        >
          {{String(hour).padStart(2, '0')}}:{{minutes}}
        </md-option>
      </md-select>
    </md-input-container>
  </div>
</template>

<script>
  export default {
    components: {

    },

    props: {
      label: {
        type: String,
        default: 'Hour'
      },

      minutes: {
        type: String,
        required: true
      },

      range: {
        type: Array,
        default() {
          return [...Array(24).keys()];
        }
      },

      hour: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
      };

    },

    computed: {
    },

    methods: {
      onSelected(value) {
        this.$emit('hour:selected', value);
      }
    }
  };
</script>

<style lang="scss">
</style>