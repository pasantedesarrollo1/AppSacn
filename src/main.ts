import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query'
import App from '@/App.vue'
import router from './router'
import './assets/main.css'

// Importar estilos de Ionic
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

// Importar estilos de Tailwind
import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)
  .use(IonicVue, {
    mode: 'md',
    animated: false
  })
  .use(router)
  .use(pinia)
  .use(VueQueryPlugin, {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  } as VueQueryPluginOptions)

app.mount('#app')