import Vue from 'vue';
import VueRouter from 'vue-router';

const Todos = () => import('@/components/Todo.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/todos',
    name: 'todos',
    component: Todos,
    meta: {
      requiredAuthentication: true,
      roles: ['admin', 'user'],
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
