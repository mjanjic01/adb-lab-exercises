<template>
  <div>
    <form @submit.stop.prevent="submit">
      <div :class="$style.search">
        <md-input-container>
          <label>Search</label>
          <md-autocomplete v-model="searchTerms"
                              print-attribute="title"
                              :max-res="5"
                              :debounce="500"
                              :fetch="fetchOptions">
          </md-autocomplete>
        </md-input-container>
        <md-button :class="$style.button" class="md-raised md-primary" :disabled="!validateForm || isLoading" @click="submit">Submit</md-button>
      </div>
      </md-layout>
      <div>
        <md-radio v-model="operator" id="operatorAnd" name="queryOperatorGroup" md-value="AND">AND</md-radio>
        <md-radio v-model="operator" id="operatorOr" name="queryOperatorGroup" md-value="OR">OR</md-radio>
      </div>
      <span :class="$style.error" v-show="!validateForm">Please enter a search query</span>
      <md-spinner v-if="isLoading" md-indeterminate class="md-accent"></md-spinner>
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        validator(value) {
          return value.operator === 'AND' || value.operator === 'OR';
        }
      },
      isLoading: {
        type: Boolean,
        required: true
      },
      isLoaded: {
        type: Boolean,
        required: true
      }
    },

    computed: {
      validateForm() {
        const isSearchTermValid = this.searchTerms.length > 0;
        const isOperatorValid = this.operator === 'AND' || this.operator === 'OR';

        return isSearchTermValid && isOperatorValid ? true : false;
      }
    },

    data() {
      return {
        searchTerms: this.value.searchTerms,
        operator: this.value.operator
      };
    },
    methods: {
      submit() {
        if (this.validateForm) {
          this.$emit('submit', {
            searchTerms: this.searchTerms,
            operator: this.operator
          });
        }
      },

      fetchOptions(search) {
        return fetch(`/api/movies/suggestions/${encodeURI(search.q.trim())}`).then(resp => resp.json());
      }
    }
  };
</script>

<style lang="scss" module>
  .error {
    display: block;
    color: red;
  }

  .search {
    display: flex;
    justify-content: space-between;
    align-items: middle;
    margin: 16px 0;

    .input {
      flex: 1;
      margin: 0;
    }

    .button {
      width: 100px;
    }
  }
</style>