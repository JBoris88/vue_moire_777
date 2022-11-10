import Vue from 'vue';
import Vuex from 'vuex';
import aspects from '@/store/modules/aspects';
import order from '@/store/modules/order';
import cart from '@/store/modules/cart';
import product from '@/store/modules/product';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAccessKey: null,
  },
  mutations: {
    updateUserAccessKey(state, userAccessKey) {
      state.userAccessKey = userAccessKey;
    },
  },
  getters: {
  },
  actions: {
  },
  modules: {
    aspects,
    order,
    cart,
    product,
  },
});
