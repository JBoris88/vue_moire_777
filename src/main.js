import Vue from 'vue';
import Router from '@/router';
import Store from '@/store';
import loader from 'vue-ui-preloader';

import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(loader);

new Vue({
  router: Router,
  store: Store,
  render: (h) => h(App),
}).$mount('#app');
