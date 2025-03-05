import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessCode = '123456';
  const isAuthenticated = ref(true); // Inicialmente autenticado para permitir acceso a la app
  const isFirstOpen = ref(true);
  const showSplashScreen = ref(true);
  const showAuthModal = ref(false);

  function setAuthenticated(value: boolean) {
    isAuthenticated.value = value;
  }

  function setFirstOpen(value: boolean) {
    isFirstOpen.value = value;
  }

  function setSplashScreenShown() {
    showSplashScreen.value = false;
  }

  function setAuthModalShown(value: boolean) {
    showAuthModal.value = value;
  }

  return {
    accessCode,
    isAuthenticated,
    isFirstOpen,
    showSplashScreen,
    showAuthModal,
    setAuthenticated,
    setFirstOpen,
    setSplashScreenShown,
    setAuthModalShown
  };
});