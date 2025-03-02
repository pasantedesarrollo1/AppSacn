import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import { useAuthStore } from '@/stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    component: HomePage, // Use the same component as home for initial route
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    // En lugar de bloquear la navegación, permitimos que continúe
    // El componente App.vue manejará la visualización del modal de autenticación
    next();
  } else {
    next();
  }
});

export default router;