<template>
    <div v-if="visible" class="splash-screen">
      <div class="splash-content">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-AIeF9eqkpixXd01gW0AfihCSEF9lSy.png" 
          alt="Logo" 
          class="splash-logo"
        />
        <h1 class="splash-title">AppScan</h1>
        <p class="splash-subtitle">Sistema de Verificación de Productos</p>
        <div class="splash-loading">
          <div class="splash-dots">
            <span class="splash-dot"></span>
            <span class="splash-dot"></span>
            <span class="splash-dot"></span>
          </div>
          <p class="splash-loading-text">Cargando...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const visible = ref(true);
  const emit = defineEmits(['complete']);
  
  onMounted(() => {
    // Mostrar la pantalla de bienvenida por 5 segundos
    setTimeout(() => {
      visible.value = false;
      emit('complete');
    }, 5000);
  });
  </script>
  
  <style scoped>
  .splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem;
  }
  
  .splash-logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin-bottom: 1.5rem;
    animation: pulse 2s infinite;
  }
  
  .splash-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  }
  
  .splash-subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
  }
  
  .splash-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .splash-dots {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .splash-dot {
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
    opacity: 0.6;
  }
  
  .splash-dot:nth-child(1) {
    animation: dot-animation 1.4s infinite ease-in-out;
  }
  
  .splash-dot:nth-child(2) {
    animation: dot-animation 1.4s infinite ease-in-out 0.2s;
  }
  
  .splash-dot:nth-child(3) {
    animation: dot-animation 1.4s infinite ease-in-out 0.4s;
  }
  
  .splash-loading-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes dot-animation {
    0%, 100% {
      opacity: 0.6;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  </style>