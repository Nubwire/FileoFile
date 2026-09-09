import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import './assets/theme.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'fileofile',
    themes: {
      fileofile: {
        dark: false,
        colors: {
          background: '#EFEAE0',
          surface: '#F7F4EC',
          primary: '#232A33',
          secondary: '#D9B776',
          error: '#B23A2E',
          info: '#232A33',
          success: '#4B6A4F',
          warning: '#B23A2E',
          'on-primary': '#EFEAE0',
          'on-secondary': '#232A33',
          hairline: '#C7BFAE'
        }
      }
    }
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'sm'
    },
    VBtn: {
      rounded: 'sm'
    }
  }
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount('#app');
