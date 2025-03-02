import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessCode = '123456';
  const isAuthenticated = ref(false);
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
    showAuthModal.value = true;
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