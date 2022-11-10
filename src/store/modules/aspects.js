import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  state: {
    categoriesAspectsData: [],
    colorAspectsData: [],
    materialAspectsData: [],
    collectionAspectsData: [],
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
  },
    
  mutations: {
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
  },
    
  actions: {
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
  },
};
