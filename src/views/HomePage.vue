<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Formulario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Formulario</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="input-container">
          <ion-input
            class="custom-input"
            placeholder="Codigo Aqui"
            @click="handleInputClick"
            fill="outline"
            shape="round"
          ></ion-input>
        </div>
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput } from '@ionic/vue';
//import { ref } from 'vue';

const handleInputClick = () => {
  console.log('Input clicked!');
  
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
}

.input-container {
  margin-bottom: 30px;
}

.custom-input {
  --background: #f0f5ff;
  --color: #333;
  --placeholder-color: #666;
  --border-radius: 10px;
  --padding-start: 15px;
  --padding-end: 15px;
  --box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 0 auto;
}

.custom-input:focus-within {
  --background: #e6f0ff;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
  margin-top: 20px;
  display: block;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>