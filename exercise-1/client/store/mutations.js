import * as types from './mutation-types';

export default {
  [types.SEARCH_REQUEST](state) {
    state.isLoading = true;
    state.query = '';
    state.data = [];
  },

  [types.SEARCH_SUCCESS](state, { query, rows }) {
    state.isLoaded = true;
    state.isLoading = false;
    state.data = rows;
    state.query = query;
  },

  [types.SEARCH_FAILURE](state) {
    state.isLoading = false;
  }
};
