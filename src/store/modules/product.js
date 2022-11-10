import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { idArticulus, stubProductDescriptions } from '@/store/helpers/productGen';

export default {
  state: {
    productsCatalogData: [],
    productCatalogTotalItems: 0,

    productsSizes: [],

    productDetailData: {},
  },
  
  getters: {
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
  },
    
  mutations: {
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
  },
    
  actions: {
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
  },
};
