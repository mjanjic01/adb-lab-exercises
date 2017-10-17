<template>
  <div>
    <movie-form
      v-model="movie"
      :status="movieFormStatus"
      @submit="onFormSubmit"
    />
  </div>
</template>

<script>
  import MovieForm from 'components/forms/MovieForm.vue';

  export default {
    components: {
      MovieForm
    },

    computed: {
    },

    data() {
      return {
        movie: {
          title: '',
          categories: [],
          summary: '',
          description: ''
        },
        movieFormStatus: ''
      }
    },
    methods: {
      onFormSubmit(formData) {
        this.movieFormStatus = 'PENDING';
        fetch('/api/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            categories: formData.categories.map(category => category.trim()).join('; '),
            summary: formData.summary.trim(),
            description: formData.description.trim()
          })
        }).then(() => {
          this.movieFormStatus = 'SUCCESS';
          setTimeout(() => {
            this.movieFormStatus = '';
          }, 3500);
        }).catch(() => {
          this.movieFormStatus = 'FAIL';
        });
      }
    }
  };
</script>

<style lang="scss">
</style>