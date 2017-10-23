import * as types from './mutation-types';

export default {
  fetchMovies({ commit }, search) {
    commit(types.SEARCH_REQUEST);
    fetch('/api/movies/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(search)
    }).then(resp => resp.json())
      .then(({ query, rows }) => {
        commit(types.SEARCH_SUCCESS, {
          query,
          rows
        });
        this.query = query;
        this.queryResult = rows;
      }).catch(() => {
        commit(types.SEARCH_FAIL);
      });
  }
};
