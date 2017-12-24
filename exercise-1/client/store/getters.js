export default {
  getMovies(state) {
    return state.data;
  },

  getQuery(state) {
    return state.query;
  },

  isMoviesLoading(state) {
    return state.isLoading;
  },

  isMoviesLoaded(state) {
    return state.isLoaded;
  }
};
