<template>
  <div>
    <form @submit.stop.prevent="submit">
      <div :class="$style.search">
        <md-input-container md-clearable :class="$style.input">
          <label>Search terms</label>
          <md-input
            v-model="searchTerms"
            @change="update"
          ></md-input>
        </md-input-container>
        <md-button :class="$style.button" class="md-raised md-primary" :disabled="!validateForm || isLoading" @click="submit">Submit</md-button>
      </div>
      </md-layout>
      <div>
        <md-radio v-model="operator" @input="update" id="operatorAnd" name="queryOperatorGroup" md-value="AND">AND</md-radio>
        <md-radio v-model="operator" @input="update" id="operatorOr" name="queryOperatorGroup" md-value="OR">OR</md-radio>
      </div>
      <span :class="$style.error" v-show="!validateForm">Categories are required</span>
      <md-spinner v-if="isLoading" md-indeterminate class="md-accent"></md-spinner>
      <span v-if="isLoaded">Query generated successfully!</span>
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
        const isSearchTermValid = this.value.searchTerms.length > 0;
        const isOperatorValid = this.value.operator === 'AND' || this.value.operator === 'OR';

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
          this.$emit('submit');
        }
      },

      update() {
        this.$emit('input', {
          searchTerms: this.searchTerms,
          operator: this.operator
        });
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