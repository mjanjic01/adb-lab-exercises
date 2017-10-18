<template>
  <div>
    <div>
      <input type="hidden" ref="picker">
    </div>

    <div ref="pickerContainer"></div>
  </div>
</template>

<script>
  import Pikaday from 'pikaday';
  import moment from 'moment';

  export default {
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

      this.picker.setStartRange(this.startDate);
      this.picker.setEndRange(this.endDate);
      const date = this.startDate || this.endDate;
      if (date) {
        this.picker.gotoMonth(date.getMonth());
        this.picker.gotoYear(date.getFullYear());
      }
      this.picker.draw();
    },

    beforeDestroy() {
      this.picker.destroy();
    },

    props: {
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    },

    watch: {
      'startDate'() {
        this.picker.setStartRange(this.startDate);

        if (this.startDate) {
          this.picker.gotoMonth(this.startDate.getMonth());
          this.picker.gotoYear(this.startDate.getFullYear());
        }

        this.picker.draw();
      },

      'endDate'() {
        this.picker.setEndRange(this.endDate);

        if (this.endDate) {
          this.picker.gotoMonth(this.endDate.getMonth());
          this.picker.gotoYear(this.endDate.getFullYear());
        }

        this.picker.draw();
      }
    },

    methods: {
      onPickerSelect() {
        const date = this.picker.getDate();
        if (!this.startDate || this.startDate > date) {
          this.$emit('start-date:update', date);
        } else {
          this.$emit('end-date:update', date);
        }
      }
    },

    data() {
      return {
        picker: null
      };
    }
  };
</script>

<style lang="scss">
  .pika-single {
    border: 0;

    &, & * {
      z-index: auto;
    }

    .pika-lendar {
      width: 288px !important; // pikaday container does not adapt width to its content
      margin: 8px 0;
    }

    .pika-title {
      .pika-label {
        font-weight: normal;
        text-transform: uppercase;
      }
    }

    .pika-table {
      abbr {
        text-decoration: none;
      }

      th {
        font-weight: normal;
        text-transform: uppercase;
      }

      td {
        padding: 1px;

        &.is-selected .pika-button {
          font-weight: normal;
          box-shadow: none;
        }

        &.is-selected.is-today .pika-button {
          font-weight: bold;
        }

        .pika-button {
          border-radius: 0;
          text-align: center;
          font-size: 14px;
          width: 38px;
          height: 38px;
        }
      }
    }
  }
</style>