import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useConfigStore } from './configStore';

export const useAuthStore = defineStore('auth', () => {
  const configStore = useConfigStore();
  // Eliminamos el código de acceso fijo y usamos una función getter
  const isAuthenticated = ref(true); // Inicialmente autenticado para permitir acceso a la app
  const isFirstOpen = ref(!localStorage.getItem("app_ruc")); // Primera apertura si no hay RUC guardado
  const showSplashScreen = ref(true);
  const showAuthModal = ref(false);

  // Función para obtener el código de acceso (ahora es el RUC)
  function getAccessCode() {
    return configStore.ruc;
  }

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
    getAccessCode, // Reemplazamos accessCode con getAccessCode
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