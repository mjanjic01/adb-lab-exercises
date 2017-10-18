<template>
  <div>
    <date-picker
        :startDate="startDate"
        :endDate="endDate"
        @start-date:update="updateLocalStartDate"
        @end-date:update="updateLocalEndDate"
      />
    <div>
      <md-button class="md-raised md-primary" :disabled="!startDate || !endDate" @click="applyValues">Apply</md-button>
      <md-button class="md-raised md-secondary" :disabled="!startDate || !endDate" @click="resetValues">Clear</md-button>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'components/core/DatePicker.vue';


  export default {
    components: {
      DatePicker
    },

    props: {
    },

    computed: {
      startDateValue: {
        get() {
          return this.startDate ? moment(this.startDate).format('DD/MM/YYYY') : '';
        },

        set(value) {
          const newDate = moment(value, 'DD/MM/YYYY').toDate();
          if (newDate) {
            this.updateLocalStartDate(newDate);
          }
        }
      },

      endDateValue: {
        get() {
          return this.endDate ? moment(this.endDate).format('DD/MM/YYYY') : '';
        },

        set(value) {
          const newDate = moment(value, 'DD/MM/YYYY').toDate();
          if (newDate) {
            this.updateLocalEndDate(newDate);
          }
        }
      }
    },

    methods: {
      updateSelectedDate(startDate, endDate) {
        this.$emit('filter:update', {
          startDate,
          endDate
        });
      },

      applyValues() {
        this.updateSelectedDate(this.startDate, this.endDate);
      },

      resetValues() {
        this.updateLocalStartDate(null);
        this.updateLocalEndDate(null);
      },

      updateLocalStartDate(value) {
        this.startDate = value;
      },

      updateLocalEndDate(value) {
        this.endDate = value;
      },

      clearValues() {
        this.resetValues();
      }
    },

    data() {
      return {
        startDate: null,
        endDate: null
      };
    }
  };
</script>

<style lang="scss">
</style>