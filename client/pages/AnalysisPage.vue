<template>
  <div>
    <md-tabs md-fixed>
      <md-tab md-label="Date range" md-icon="date_range">
        <div class="container">
        <daterange-picker @daterange:update="dateFilterUpdate"/>
        </div>
      </md-tab>

      <md-tab md-label="Time range" md-icon="timelapse">
        <div class="container">
          <timerange-picker @timerange:update="timeFilterUpdate"/>
        </div>
      </md-tab>
    </md-tabs>
    <div class="container">
      <md-table v-if="rows" :class="$style.results">
          <md-table-header>
            <md-table-row>
              <md-table-head v-for="key in Object.keys(rows[0])" :key="key">{{key}}</md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="row in rows" :key="row.query">
              <md-table-cell v-for="key in Object.keys(row)" :key="key">{{row[key]}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
    </div>
  </div>
</template>

<script>
  import DaterangePicker from 'components/DaterangePicker.vue';
  import TimerangePicker from 'components/TimerangePicker.vue';

  export default {
    components: {
      DaterangePicker,
      TimerangePicker
    },

    data() {
      return {
        rows: null
      };

    },

    computed: {
    },

    methods: {
      dateFilterUpdate(interval) {
        this.fetchLog(interval, 'DAY');
      },

      timeFilterUpdate(interval) {
        this.fetchLog(interval, 'HOUR');
      },

      fetchLog(interval, granulation) {
        fetch('/api/movies/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...interval,
            granulation
          })
        }).then(resp => resp.json())
          .then(data => {
            this.rows = data.rows;
          }).catch((e) => {
            console.log(e); // ignore
          });
      }
    }
  };
</script>

<style lang="scss" module>
  .results {
    overflow: auto;
    max-height: 500px;
  }
</style>