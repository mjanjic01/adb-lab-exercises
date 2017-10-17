<template>
  <div>
    <query-form
      v-model="queryForm"
      :isLoading="isMoviesLoading"
      :isLoaded="isMoviesLoaded"
      @submit="onFormSubmit"
    />
    <md-input-container>
      <label>Query string:</label>
      <md-textarea :class="$style.textarea" v-model="getQuery" readonly></md-textarea>
    </md-input-container>
    <md-table :class="$style.results">
      <md-table-header>
        <md-table-row>
          <md-table-head>Title</md-table-head>
          <md-table-head>Description</md-table-head>
          <md-table-head>Rank</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="row in getMovies" :key="row.movieId">
          <md-table-cell><div v-html="row.titleheadline"></div></md-table-cell>
          <md-table-cell><div v-html="row.descriptionheadline"></div></md-table-cell>
          <md-table-cell>{{row.rank}}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import QueryForm from 'components/forms/QueryForm.vue';

  export default {
    components: {
      QueryForm
    },

    computed: {
      ...mapGetters([
        'getMovies',
        'getQuery',
        'isMoviesLoading',
        'isMoviesLoaded'
      ])
    },

    data() {
      return {
        queryForm: {
          searchTerms: '',
          operator: 'AND'
        }
      }
    },
    methods: {
      onFormSubmit(formData) {
        this.fetchMovies(formData);
      },

      ...mapActions([
        'fetchMovies'
      ])
    }
  };
</script>

<style lang="scss" module>
  .textarea {
    // no option to configure textarea like this
    resize: vertical !important;
    min-height: 200px !important;
    font-family: monospace !important;
    font-size: 16px !important;
    color: #040404 !important;
  }

  .results {
    overflow: auto;
    max-height: 500px;
  }
</style>