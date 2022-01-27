import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import Audio from '@/views/Audio.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about2',
    name: 'about2',
    component: About,
  },
  {
    path: '/manage',
    // alias:'/manage-audio',
    name: 'manage',
    meta: {
      requiresAuth: true,
    },
    beforeEnter: (to, from, next) => {
      console.log('Manage guard');
      next();
    },
    component: Manage,
  },
  {
    path: '/audio/:id',
    name: 'audio',
    component: Audio,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

// Global guard
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  console.log('Global Guard');
  // console.log(to.matched);
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
