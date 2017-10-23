import VueRouter from 'vue-router';

import AddPage from './pages/AddPage.vue';
import SearchPage from './pages/SearchPage.vue';
import AnalysisPage from './pages/AnalysisPage.vue';

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
  path: '/analysis',
  component: AnalysisPage,
  name: 'analysis'
}, {
  path: '*', redirect: '/'
}];

const router = new VueRouter({
  routes
});

export default router;
