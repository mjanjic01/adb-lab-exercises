import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';

import App from './App.vue';

import router from './router';
// import store from './store';

const APP_CONTAINER_ID = 'app';
const appContainer = document.getElementById(APP_CONTAINER_ID);

Vue.use(VueMaterial)
Vue.use(VueRouter);

new Vue({ // eslint-disable-line no-new
  el: appContainer,
  render: (renderFunc) => renderFunc(App),
  // store,
  router,
  data() {
    return {};
  }
});
