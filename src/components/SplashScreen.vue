<template>
  <div v-if="visible" class="splash-screen">
    <div class="splash-content">
      <div class="logo-container">
        <img 
          src="../assets/wanqaraicon1.png" 
          alt="Logo" 
          class="splash-logo"
        />
        <div class="logo-glow"></div>
      </div>

      <div class="text-content">
        <h1 class="splash-title">App Visor de Precios</h1>
        <h2 class="company-name">TodoNeg S.A.</h2>
      </div>

      <!-- Removed the loading-container with the spinner -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const visible = ref(true);
const emit = defineEmits(['complete']);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
    emit('complete');
  }, 5000);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e40af 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Poppins', sans-serif;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  gap: 3rem;
  max-width: 80%;
}

.logo-container {
  position: relative;
  width: 250px;
  height: 250px;
}

.splash-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  animation: pulse 3s ease-in-out infinite;
  border-radius: 25%;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(20px);
  animation: glow 2s ease-in-out infinite alternate;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.splash-title {
  font-size: 4rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
  animation: fadeIn 1s ease-out;
}

.company-name {
  font-size: 2.5rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
  animation: fadeIn 1s ease-out 0.3s both;
}

/* Removed loading-container related styles */

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes glow {
  from { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  to { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}

/* Removed dash animation */

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .splash-title {
    font-size: 3.5rem;
  }

  .company-name {
    font-size: 2rem;
  }
}
</style>