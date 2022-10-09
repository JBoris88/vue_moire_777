import numberFormat from '@/helpers/numberFormat';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

function createCartErrorObject(commonMessage, messageObject) {
  if ((Object.keys(messageObject).length !== 0) || (commonMessage !== '')) {
    return {
      commonMessage,
      ...messageObject,
    };
  }
  return {};
}

function idArticulus(value) {
  return `00001-${value}`;
}

function stubProductDescriptions(value) {
  return [
    { 
      title: 'Информация о товаре',
      ContentElements: [
        {
          title: value.title,
          rows: [`Артикул: ${idArticulus(value.id)}`],
        },
        {
          title: 'Состав',
          rows: [
            '60% хлопок',
            '30% полиэстер',
          ],
        }, {
          title: 'Уход',
          rows: [
            'Машинная стирка при макс. 30ºC короткий отжим',
            'Гладить при макс. 110ºC',
            'Не использовать машинную сушку',
            'Отбеливать запрещено',
            'Не подвергать химчистке',
          ],              
        },
      ],
    }, 
    { 
      title: 'Доставка и возврат',
      ContentElements: [
        {
          title: 'Доставка',
          rows: [
            '1. Курьерская доставка по Москве и Московской области – 290 ₽',
            '2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь',
          ],

        }, {
          title: 'Возврат',
          rows: [
            'Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.',
            'Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.',
            'БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.',
            'Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09',
          ],               
        },
      ],
    },
  ];
}

export default new Vuex.Store({
  state: {
    userAccessKey: null,

    categoriesAspectsData: [],
    colorAspectsData: [],
    materialAspectsData: [],
    collectionAspectsData: [],

    deliveryTypesData: [],
    paymentTypesData: [],

    productsCatalogData: [],
    productCatalogTotalItems: 0,

    productsSizes: [],

    productDetailData: {},

    cartLoading: true,
    cartFailLoading: true,

    cartItemsData: [],

    orderCreationError: {},
    orderCreationErrorMessage: '',

    orderInfoData: {},
  },
  mutations: {
    updateUserAccessKey(state, userAccessKey) {
      state.userAccessKey = userAccessKey;
    },

    updateCategoriesAspectsData(state, data) {
      state.categoriesAspectsData = (data.items ? data.items.map((category) => ({ id: category.id, title: category.title })) : []);
    },
    updateColorAspectsData(state, data) {
      state.colorAspectsData = (data.items ? data.items.map((color) => ({ id: color.id, color: color.code })) : []);
    },
    updateMaterialAspectsData(state, data) {
      state.materialAspectsData = (data.items ? data.items.map((material) => ({ id: material.id, title: material.title, productsCount: material.productsCount })) : []);
    },
    updateCollectionAspectsData(state, data) {
      state.collectionAspectsData = (data.items ? data.items.map((collection) => ({ id: collection.id, title: collection.title, productsCount: collection.productsCount })) : []);
    },
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

    updateCatalodProductsData(state, data) {
      state.productsCatalogData = data.items ? data.items.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        colorsOfProduct: product.colors.map((x) => ({ 
          id: x.color.id, 
          color: x.color.code, 
          image: x.gallery ? x.gallery[0].file.url : '',
        })),
      })) 
        : [];

      state.productCatalogTotalItems = data.pagination ? data.pagination.total : 0;
    },
    updateDetailProductData(state, data) {
      state.productDetailData = data ? {
        id: data.id,
        title: data.title, 
        price: data.price,
        partNumber: idArticulus(data.id),
        categoryId: data.category ? data.category.id : 0,
        categoryTitle: data.category ? data.category.title : '',
        productDescriptions: stubProductDescriptions({ id: data.id, title: data.title }),
        colors: data.colors ? data.colors.map((x) => ({ 
          id: x.color.id, 
          color: x.color.code, 
          image: x.gallery ? (x.gallery[0].file.url || '') : '',
        })) : [],
        sizes: data.sizes ? data.sizes.map((x) => ({ 
          id: x.id, 
          title: x.title,
        })) : [],
      }
        : {};
    },
    updateProductsSizes(state, data) {
      const productId = data ? data.id : 0;
      const sizes = data.sizes ? data.sizes.map((x) => ({
        productId,
        id: x.id, 
        title: x.title,
      })) : [];
      state.productsSizes = state.productsSizes.filter((f) => (f.productId !== productId));
      state.productsSizes = state.productsSizes.concat(sizes);
    },
    resetProductsSizes(state) {
      state.productsSizes = [];
    },
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
  getters: {
    categoriesAspects(state) {
      return state.categoriesAspectsData; 
    },
    colorAspects(state) {
      return state.colorAspectsData;
    },
    materialAspects(state) {
      return state.materialAspectsData;
    },
    collectionAspects(state) {
      return state.collectionAspectsData;
    },
    deliveryTypes(state) {
      return state.deliveryTypesData;
    },
    paymentTypes(state) {
      return state.paymentTypesData;
    },
    getProductSizes(state) {
      return state.productsSizes;
    },
    // eslint-disable-next-line no-unused-vars
    catalogProductsPerPageDafault(state) {
      return 6;
    },
    // eslint-disable-next-line no-unused-vars
    catalogProductsPerPageVariants(state) {
      return [3, 6, 12];
    },
    countCatalogProducts(state) {
      return state.productCatalogTotalItems;
    },
    catalogProducts(state) {
      return state.productsCatalogData;
    },

    detailProduct(state) {
      return state.productDetailData;
    },
    detailProductColors(state) {
      return state.productDetailData.colors || [];
    },
    detailProductSizes(state) {
      return state.productDetailData.sizes || [];
    },
    detailProductDefaultColor(state) {
      if (state.productDetailData) {
        return state.productDetailData.colors ? state.productDetailData.colors[0].id : 0;
      } 
      return 0;      
    },
    detailProductDefaultSize(state) {
      if (state.productDetailData) {
        return state.productDetailData.sizes ? state.productDetailData.sizes[0].id : 0;
      } 
      return 0;
    },

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
  actions: {
    loadCart(context) {
      context.commit('updateCartLoading', true);

      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => { 
          if (!context.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey); 
          }
          context.commit('updateCartItemsData', response.data.items);
          return createCartErrorObject('', {});
        })
        .catch((error) => createCartErrorObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => { context.commit('updateCartLoading', false); });
    },
    loadCategoriesAspects(context) {
      return axios.get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => { context.commit('updateCategoriesAspectsData', response.data); })
        .catch(() => { context.commit('updateCategoriesAspectsData', []); });
    },    
    loadColorAspects(context) {
      return axios.get(`${API_BASE_URL}/api/colors`)
        .then((response) => { context.commit('updateColorAspectsData', response.data); })
        .catch(() => { context.commit('updateColorAspectsData', []); });
    },
    loadMaterialAspects(context) {
      return axios.get(`${API_BASE_URL}/api/materials`)
        .then((response) => { context.commit('updateMaterialAspectsData', response.data); })
        .catch(() => { context.commit('updateMaterialAspectsData', []); });
    },
    loadCollectionAspects(context) {
      return axios.get(`${API_BASE_URL}/api/seasons`)
        .then((response) => { context.commit('updateCollectionAspectsData', response.data); })
        .catch(() => { context.commit('updateCollectionAspectsData', []); });
    },
    loadDeliveryTypes(context) {
      return axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => { context.commit('updateDeliveryTypesData', response.data); })
        .catch(() => { context.commit('updateDeliveryTypesData', []); });
    },
    loadPaymentTypes(context, deliveryTypeId) {
      return axios.get(`${API_BASE_URL}/api/payments?deliveryTypeId=${deliveryTypeId}`)
        .then((response) => { context.commit('updatePaymentTypesData', response.data); })
        .catch(() => { context.commit('updatePaymentTypesData', []); });
    },
    loadProductSizes(context, productId) {
      return axios.get(`${API_BASE_URL}/api/products/${productId}`)
        .then((response) => { context.commit('updateProductsSizes', response.data); });
    },
    loadCatalogProducts(context, filterProductParams) {
      return axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          categoryId: filterProductParams.filterCategoryId,
          materialIds: filterProductParams.filterMaterialsAspects,
          seasonIds: filterProductParams.filterCollectionAspects,
          colorIds: filterProductParams.filterColorsAspects,
          page: filterProductParams.currentPage,
          limit: filterProductParams.productsPerPage,
          minPrice: filterProductParams.filterPriceFrom,
          maxPrice: filterProductParams.filterPriceTo,
        },
      })
        .then((response) => { context.commit('updateCatalodProductsData', response.data); });
    },
    loadDetailProduct(context, productId) {
      return axios.get(`${API_BASE_URL}/api/products/${productId}`)
        .then((response) => { 
          context.commit('resetProductsSizes');           
          context.commit('updateDetailProductData', response.data); 
        });
    },

    addProductToCart(context, { 
      productId, 
      colorId, 
      sizeId, 
      amount,
    }) {
      context.commit('updateCartLoading', true);

      return axios.post(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        colorId,
        sizeId,
        quantity: amount,
      }, {
        params: { userAccessKey: context.state.userAccessKey },
      })
        .then((response) => {
          context.commit('updateCartItemsData', response.data.items); 
          return createCartErrorObject('', {});
        })
        .catch((error) => createCartErrorObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          context.commit('updateCartLoading', false); 
        });
    },
    deleteCartItem(context, cartItemId) {
      context.commit('updateCartLoading', true);

      return axios.delete(`${API_BASE_URL}/api/baskets/products`, { 
        data: {
          basketItemId: cartItemId,
        },
        params: { userAccessKey: context.state.userAccessKey },
      })
        .then((response) => {
          context.commit('updateCartItemsData', response.data.items);
          return createCartErrorObject('', {});
        })
        .catch((error) => createCartErrorObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          context.commit('updateCartLoading', false); 
        });      
    },
    updateCartItemQuantity(context, { cartItemId, quantity }) {
      if (quantity < 1) {
        return;
      }

      context.commit('updateCartLoading', true);

      // eslint-disable-next-line consistent-return
      return axios.put(`${API_BASE_URL}/api/baskets/products`, {
        basketItemId: cartItemId,
        quantity,
      }, {
        params: { userAccessKey: context.state.userAccessKey },
      })
        .then((response) => {
          context.commit('updateCartItemsData', response.data.items);
          return createCartErrorObject('', {});
        })
        .catch((error) => createCartErrorObject(error.response.data.error.message || '', error.response.data.error.request || {}))
        .finally(() => {
          context.commit('updateCartLoading', false); 
        }); 
    },
    createOrder(context, {
      name,
      address,
      phone,
      email,
      deliveryTypeId,
      paymentTypeId,
      comment,
    }) {
      context.commit('updateCreateOrderError', {});
      context.commit('updateCreateOrderErrorMessage', '');

      return axios.post(`${API_BASE_URL}/api/orders`, {
        name,
        address,
        phone,
        email,
        deliveryTypeId,
        paymentTypeId,
        comment,
      }, {
        params: { userAccessKey: context.state.userAccessKey },
      })
        .then((response) => {
          context.commit('resetCart');
          return response.data.id;
        }).catch((error) => {
          context.commit('updateCreateOrderError', error.response.data.error.request || {});
          context.commit('updateCreateOrderErrorMessage', error.response.data.error.message || ''); 
        });
    },
    loadOrder(context, orderId) {
      return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => { 
          context.commit('updateOrderInfoData', response.data); 
        });
    },  
  },
});
