<template>
  <ion-app>
    <!-- Modal de autenticación -->
    <auth-modal 
      :is-open="authStore.showAuthModal" 
      @authenticated="onAuthenticated" 
      @exit="exitApp"
    />
    
    <!-- Contenido principal de la app -->
    <ion-router-outlet v-if="authStore.isAuthenticated" />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useAuthStore } from './stores/authStore';
import AuthModal from './components/AuthModal.vue';
import { SplashScreen } from '@capacitor/splash-screen';

const authStore = useAuthStore();

// Función para manejar la autenticación exitosa
const onAuthenticated = () => {
  authStore.setAuthenticated(true);
  authStore.setAuthModalShown(false);
};

// Función para salir de la aplicación
const exitApp = () => {
  if (window.navigator && (window.navigator as any).app) {
    (window.navigator as any).app.exitApp();
  } else {
    window.close();
  }
};

onMounted(async () => {
  // Asegurarse de que el usuario no esté autenticado al iniciar la app
  authStore.setAuthenticated(false);
  
  try {
    // Ocultar el splash screen nativo después de un tiempo
    setTimeout(async () => {
      await SplashScreen.hide();
      // Mostrar el modal de autenticación después de ocultar el splash screen
      authStore.setAuthModalShown(true);
    }, 3000); // 3 segundos de duración para el splash screen
  } catch (error) {
    console.error('Error al manejar el SplashScreen:', error);
    // Fallback en caso de error
    authStore.setAuthModalShown(true);
  }
});
</script>