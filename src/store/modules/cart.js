import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { idArticulus } from '@/store/helpers/productGen';

function createCartResponseObject(commonMessage, messageObject) {
  if ((Object.keys(messageObject).length !== 0) || (commonMessage !== '')) {
    return {
      commonMessage,
      ...messageObject,
    };
  }
  return {};
}

export default {
  state: {
    cartLoading: true,
    cartFailLoading: true,

    cartItemsData: [],
  },
  
  getters: {
    cartStillLoading(state) {
      return state.cartLoading;
    },
    cartTotalPositionsNumber(state) {
      return state.cartItemsData.length || 0;
    },
    cartTotalSum(state) {
      return state.cartItemsData.reduce((acc, item) => (item.unitPrice * item.quantity) + acc, 0);
    },
    cartItems(state) {
      return state.cartItemsData;
    },
  },
    
  mutations: {
    updateCartLoading(state, value) {
      state.cartLoading = value;
    },
    updateCartItemsData(state, data) {
      state.cartItemsData = (data ? data.map((x) => ({ 
        cartItemId: x.id,
        productId: x.product.id,
        image: x.color.gallery ? x.color.gallery[0].file.url : '',
        title: x.product.title,
        quantity: x.quantity,
        partNumber: idArticulus(x.product.id),
        itemTotalSum: x.quantity * x.price,
        colorId: x.color ? x.color.color.id : 0,
        color: x.color ? x.color.color.code : '',
        colorTitle: x.color ? x.color.color.title : '',
        sizeId: x.size ? x.size.id : 0,
        sizeTitle: x.size ? x.size.title : '',
        unitPrice: x.price,
      })) : []);
    },
    resetCart(state) {
      state.cartItemsData = [];
    },
  },
    
  actions: {
    loadCart({ 
      commit, 
      rootState,
    }) {
      commit('updateCartLoading', true);
  
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
        .then((response) => { 
          if (!rootState.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            commit('updateUserAccessKey', response.data.user.accessKey); 
          }
          commit('updateCartItemsData', response.data.items);
          return createCartResponseObject('', {});
        })
        .catch((error) => createCartResponseObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => { commit('updateCartLoading', false); });
    },    
    addProductToCart({ 
      commit, 
      rootState,
    }, { 
      productId, 
      colorId, 
      sizeId, 
      amount,
    }) {
      commit('updateCartLoading', true);
  
      return axios.post(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        colorId,
        sizeId,
        quantity: amount,
      }, {
        params: { userAccessKey: rootState.userAccessKey },
      })
        .then((response) => {
          commit('updateCartItemsData', response.data.items); 
          return createCartResponseObject('', {});
        })
        .catch((error) => createCartResponseObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          commit('updateCartLoading', false); 
        });
    },
    deleteCartItem({ 
      commit, 
      rootState,
    }, cartItemId) {
      commit('updateCartLoading', true);
  
      return axios.delete(`${API_BASE_URL}/api/baskets/products`, { 
        data: {
          basketItemId: cartItemId,
        },
        params: { userAccessKey: rootState.userAccessKey },
      })
        .then((response) => {
          commit('updateCartItemsData', response.data.items);
          return createCartResponseObject('', {});
        })
        .catch((error) => createCartResponseObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          commit('updateCartLoading', false); 
        });      
    },
    updateCartItemQuantity({ 
      commit, 
      rootState,
    }, { cartItemId, quantity }) {
      if (quantity < 1) {
        return;
      }
  
      commit('updateCartLoading', true);

      // eslint-disable-next-line consistent-return
      return axios.put(`${API_BASE_URL}/api/baskets/products`, {
        basketItemId: cartItemId,
        quantity,
      }, {
        params: { userAccessKey: rootState.userAccessKey },
      })
        .then((response) => {
          commit('updateCartItemsData', response.data.items);
          return createCartResponseObject('', {});
        })
        .catch((error) => createCartResponseObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          commit('updateCartLoading', false); 
        }); 
    },
  },
};
