import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { idArticulus } from '@/store/helpers/productGen';

export default {
  state: {
    deliveryTypesData: [],
    paymentTypesData: [],

    orderCreationError: {},
    orderCreationErrorMessage: '',

    orderInfoData: {},
  },
  
  getters: {
    deliveryTypes(state) {
      return state.deliveryTypesData;
    },
    paymentTypes(state) {
      return state.paymentTypesData;
    },    
    getOrderCreationError(state) {
      return state.orderCreationError;
    },
    getOrderCreationErrorMessage(state) {
      return state.orderCreationErrorMessage;
    },
  
    orderInfoDetail(state) {
      return state.orderInfoData;
    },
    orderInfoDetailItems(state) {
      return state.orderInfoData.items || [];
    },
    orderStillLoading(state) {
      return state.orderLoading;
    }, 
  },
    
  mutations: {
    updateDeliveryTypesData(state, data) {
      state.deliveryTypesData = (data ? data.map((x) => ({ 
        id: x.id, 
        title: x.title, 
        title2: +(x.price) > 0 ? `${numberFormat(x.price)} ₽` : 'бесплатно', 
        price: x.price, 
      })) : []);    
    },
    updatePaymentTypesData(state, data) {
      state.paymentTypesData = (data ? data.map((x) => ({ id: x.id, title: x.title })) : []);
    },    
    updateCreateOrderError(state, value) {
      state.orderCreationError = value;
    },
    updateCreateOrderErrorMessage(state, value) {
      state.orderCreationErrorMessage = value;
    }, 
    
    updateOrderInfoData(state, data) {
      state.orderInfoData = data
        ? {
          id: data.id,
          orderNumder: idArticulus(data.id),
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          paymentType: data.paymentType,
          totalOrderItems: (data.basket.items).length || 0,
          totalOrderSum: data.totalPrice,
          deliverySumText: +(data.deliveryType.price) > 0 ? `${numberFormat(data.deliveryType.price)} ₽` : 'бесплатно',
          items: data.basket.items ? data.basket.items.map((x) => (
            {
              cartItemId: x.id,
              title: x.product.title,
              partNumber: idArticulus(x.product.id),
              itemTotalSum: x.quantity * x.price,
            }
          ))
            : [],
        }
        : {};
    },
  },
    
  actions: {
    loadDeliveryTypes(context) {
      return axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => { context.commit('updateDeliveryTypesData', response.data); })
        .catch(() => { context.commit('updateDeliveryTypesData', []); });
    },
    loadPaymentTypes(context, deliveryTypeId) {
      return (new Promise(() => { 
        if (deliveryTypeId !== 0) {
          axios.get(`${API_BASE_URL}/api/payments?deliveryTypeId=${deliveryTypeId}`)
            .then((response) => { context.commit('updatePaymentTypesData', response.data); })
            .catch(() => { context.commit('updatePaymentTypesData', []); });
        } else {
          context.commit('updatePaymentTypesData', []);
        }
      }));
    },    
    createOrder({ 
      commit, 
      rootState,
    }, {
      name,
      address,
      phone,
      email,
      deliveryTypeId,
      paymentTypeId,
      comment,
    }) {
      commit('updateCreateOrderError', {});
      commit('updateCreateOrderErrorMessage', '');
  
      return axios.post(`${API_BASE_URL}/api/orders`, {
        name,
        address,
        phone,
        email,
        deliveryTypeId,
        paymentTypeId,
        comment,
      }, {
        params: { userAccessKey: rootState.userAccessKey },
      })
        .then((response) => {
          commit('resetCart');
          return response.data.id;
        }).catch((error) => {
          commit('updateCreateOrderError', error.response.data.error.request || {});
          commit('updateCreateOrderErrorMessage', error.response.data.error.message || ''); 
        });
    },
    loadOrder({ 
      commit, 
      rootState,
    }, orderId) {
      return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
        .then((response) => { 
          commit('updateOrderInfoData', response.data); 
        });
    }, 
  },
};
