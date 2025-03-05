<template>
  <ion-app>
    <!-- Contenido principal de la app -->
    <VueQueryDevtools v-if="import.meta.env.DEV" />
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useAuthStore } from './stores/authStore';
import { SplashScreen } from '@capacitor/splash-screen';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
const authStore = useAuthStore();

onMounted(async () => {
  // Establecer autenticado como true para permitir acceso directo a la app
  authStore.setAuthenticated(true);
  
  try {
    // Ocultar el splash screen nativo después de un tiempo
    setTimeout(async () => {
      await SplashScreen.hide();
    }, 3000); // 3 segundos de duración para el splash screen
  } catch (error) {
    console.error('Error al manejar el SplashScreen:', error);
  }
});
</script>