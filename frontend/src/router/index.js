import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: { title: 'FileoFile — Secure Document Storage for Insurance Brokers' }
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true, title: 'Login — FileoFile' }
  },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard — FileoFile' }
  },
  {
    path: '/documents',
    component: () => import('../views/Documents.vue'),
    meta: { requiresAuth: true, title: 'Documents — FileoFile' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || 'FileoFile';
});

export default router;
