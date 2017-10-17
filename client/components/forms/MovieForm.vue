<template>
  <div>
    <form @submit.stop.prevent="submit">
      <md-input-container md-clearable>
        <label>Title</label>
        <md-input
          v-model="title"
          @change="update"
        ></md-input>
      </md-input-container>
      <md-chips
        v-model="categories"
        @change="update"
        md-input-placeholder="Add a category"
      ></md-chips>
      <md-input-container md-clearable>
        <label>Summary</label>
        <md-input
          v-model="summary"
          @change="update"
        ></md-input>
      </md-input-container>
      <md-input-container md-clearable>
        <label>Description</label>
        <md-input
          v-model="description"
          @change="update"
        ></md-input>
      </md-input-container>
      <span :class="$style.error" v-show="!validateForm">Categories are required</span>
      <md-button class="md-raised md-primary" :disabled="!validateForm || isPending" @click="submit">Submit</md-button>
      <md-spinner v-if="isPending" md-indeterminate class="md-accent"></md-spinner>
      <span v-if="isSuccess">Movie added successfully!</span>
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    },

    computed: {
      validateForm() {
        const isTitleValid = this.value.title.length > 0;
        const isCategoriesValid = this.value.categories.length > 0;
        const isSummaryValid = this.value.summary.length > 0;
        const isDescriptionValid = this.value.description.length > 0;

        return isTitleValid && isCategoriesValid && isSummaryValid && isDescriptionValid ? true : false;
      },

      isPending() {
        return this.status === 'PENDING';
      },

      isSuccess() {
        return this.status === 'SUCCESS';
      }
    },

    data() {
      return {
        title: this.value.title,
        categories: this.value.categories,
        summary: this.value.summary,
        description: this.value.description
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
          title: this.title,
          categories: this.categories,
          summary: this.summary,
          description: this.description
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
</style>