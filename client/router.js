import VueRouter from 'vue-router';

import AddPage from './pages/AddPage.vue';

const routes = [{
  path: '/',
  redirect: {
    name: 'add'
  }
}, {
  path: '/add',
  component: AddPage,
  name: 'add'
},
{
  path: '*', redirect: '/'
}];

const router = new VueRouter({
  routes
});

export default router;
