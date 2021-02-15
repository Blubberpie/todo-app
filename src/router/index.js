import Vue from 'vue';
import VueRouter from 'vue-router';

const Todos = () => import('@/components/Todo.vue');
const Login = () => import('@/components/Login.vue');
const Register = () => import('@/components/Register.vue');

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
  {
    path: '/login',
    alias: ['/'],
    name: 'login',
    component: Login,
    meta: {
      requiredAuthentication: false,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiredAuthentication: false,
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

const beforeRouteEnter = async (to, from, next) => {
  if (to.meta.requiredAuthentication) {
    if (Vue.$store.getters['auth/authenticated']) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }
};

router.beforeEach(beforeRouteEnter);

Vue.$router = router;

export default router;
