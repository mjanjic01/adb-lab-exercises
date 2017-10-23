
<template>
  <div>
    <input type="hidden" ref="picker">
    <div ref="pickerContainer"></div>
    <div :class="$style.timepicker">
      <time-picker :label="'Start time'" :minutes="'00'" :hour="startHour" @hour:selected="onStartHourUpdated" />
      <div :class="$style.divider"></div>
      <time-picker :label="'End time'" :minutes="'59'" :hour="endHour" :range="endHourRange" @hour:selected="onEndHourUpdated" />
    </div>
    <div>
      <md-button class="md-raised md-primary" :disabled="!day" @click="applyValues">Apply</md-button>
    </div>
  </div>
</template>

<script>
  import Pikaday from 'pikaday';
  import moment from 'moment';

  import TimePicker from './core/TimePicker.vue';

  export default {
    components: {
      TimePicker
    },

    props: {
    },

    data() {
      return {
        startHour: 0,
        endHour: 0,
        day: null,
        picker: null
      };

    },

    computed: {
      endHourRange() {
        if (this.endHour < this.startHour) {
          this.endHour = this.startHour;
        }
        return Array.from({
          length: 24 - this.startHour
        }, (v, k) => k + this.startHour);

      }
    },

    methods: {
      onStartHourUpdated(value) {
        this.startHour = value;
      },

      onEndHourUpdated(value) {
        this.endHour = value;
      },

      applyValues() {
        this.$emit('timerange:update', {
          startTime: moment(this.day).hour(this.startHour).format(),
          endTime: moment(this.day).hour(this.endHour).endOf('hour').format()
        });
      },

      onPickerSelect() {
        this.day = this.picker.getDate();
      }
    },

    mounted() {
      const minDate = moment().subtract(2, 'years').toDate();
      const maxDate = moment().toDate();

      this.picker = new Pikaday({
        field: this.$refs.picker,
        bound: false,
        showDaysInNextAndPreviousMonths: true,
        container: this.$refs.pickerContainer,
        firstDay: 1,
        minDate,
        maxDate,
        onSelect: () => {
          this.onPickerSelect();
        }
      });

      // Remove keydown listener from document.
      // Pikaday adds listener for navigation in calendar.
      // Navigation in other input fields or any other use of arrow keys causes pikaday to change selected date.
      window.document.removeEventListener('keydown', this.picker._onKeyChange);

      this.picker.show();
      this.picker.draw();
    },

    beforeDestroy() {
      this.picker.destroy();
    }
  };
</script>

<style lang="scss" module>
  .timepicker {
    display: flex;
    align-items: center;

    .divider {
      width: 10px;
      height: 2px;
      margin: 0 8px;
      background-color: #D0D0D0;
    }
  }
</style>