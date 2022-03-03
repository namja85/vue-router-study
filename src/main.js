import { createApp } from 'vue'
import { globalState } from './store';
import { router } from './router';
import App from './App.vue'

createApp(App)
    .provide('state', globalState)
    .use(router)
    .mount('#app')
