import './assets/main.css';
import { createApp } from 'vue';


import store from './store/store';

import App from './App.vue';

const a = createApp(App)

a.use(store)
a.mount('#app')