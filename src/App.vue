<template>
  <ion-app>
    <!-- Pantalla de bienvenida -->
    <splash-screen v-if="authStore.showSplashScreen" @complete="onSplashComplete" />
    
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
import SplashScreen from './components/SplashScreen.vue';
import AuthModal from './components/AuthModal.vue';

const authStore = useAuthStore();

// Función para manejar cuando la pantalla de bienvenida termina
const onSplashComplete = () => {
  authStore.setSplashScreenShown();
};

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

onMounted(() => {
  // Asegurarse de que el usuario no esté autenticado al iniciar la app
  authStore.setAuthenticated(false);
  
  // Si no es la primera vez que se abre la app, saltamos el SplashScreen
  if (!authStore.isFirstOpen) {
    authStore.setSplashScreenShown();
  }
});
</script>