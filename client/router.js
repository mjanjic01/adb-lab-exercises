import VueRouter from 'vue-router';

import AddPage from './pages/AddPage.vue';
import SearchPage from './pages/SearchPage.vue';
import AnalisysPage from './pages/AnalisysPage.vue';

const routes = [{
  path: '/',
  redirect: {
    name: 'add'
  },
}, {
  path: '/add',
  component: AddPage,
  name: 'add'
}, {
  path: '/search',
  component: SearchPage,
  name: 'search'
}, {
  path: '/analisys',
  component: AnalisysPage,
  name: 'analisys'
}, {
  path: '*', redirect: '/'
}];

const router = new VueRouter({
  routes
});

export default router;
