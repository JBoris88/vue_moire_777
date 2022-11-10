<template>
      <aside class="filter">
        <form class="filter__form form" action="#" method="get" @submit.prevent="submit()">
          <fieldset class="form__block">
            <legend class="form__legend">Цена</legend>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
              <span class="form__value">От</span>
            </label>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
              <span class="form__value">До</span>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Категория</legend>
            <label class="form__label form__label--select">
              <select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
                <option value="0">Все категории</option>
                <option :value="cat.id" v-for="cat in categoriesAspectsData" :key="cat.id">{{ cat.title }}</option>
              </select>
            </label>
          </fieldset>

          <base-color-aspect-filter :selectedColors="currentColorsAspects" :colorVariants="colorAspectsData" @colors-aspect-selected="colorSelected"/>
          <base-aspect-filter :selectedAspects="currentMaterialsAspects" :aspectName="'Материал'" :aspectVariants ="materialAspectsData" @aspect-selected="materialSelected"/>
          <base-aspect-filter :selectedAspects="currentCollectionAspects" :aspectName="'Коллекция'" :aspectVariants ="collectionAspectsData" @aspect-selected="collectionSelected"/>

          <button class="filter__submit button button--primery" type="submit">
            Применить
          </button>
          <button class="filter__reset button button--second" type="button" @click="reset()" v-if="visibleResetFiltrationButton">
            Сбросить
          </button>
        </form>
      </aside>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BaseAspectFilter from '@/components/BaseAspectFilter.vue';
import BaseColorAspectFilter from '@/components/BaseColorAspectFilter.vue';

export default {
  components: {
    BaseAspectFilter,
    BaseColorAspectFilter,
  },
  props: {
    productParams: {
      type: Object,
      required: true,
    },
    productFiltered: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorsAspects: [],      
      currentMaterialsAspects: [],
      currentCollectionAspects: [],
    };
  },
  computed: {
    ...mapGetters({ 
      categoriesAspectsData: 'categoriesAspects', 
      colorAspectsData: 'colorAspects', 
      materialAspectsData: 'materialAspects',
      collectionAspectsData: 'collectionAspects',
    }),
    categories() {
      return this.categoriesAspectsData;
    },
    visibleResetFiltrationButton() {
      return (
        this.productFiltered
      );
    },
  },
  watch: {
    productParams: {
      handler: 'setCurrentProductParamsFromProps',
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getCategoriesAspects();
    this.getColorAspects();
    this.getMaterialAspects();
    this.getCollectionAspects();
  },   
  methods: {
    ...mapActions({
      getCategoriesAspects: 'loadCategoriesAspects',
      getColorAspects: 'loadColorAspects',
      getMaterialAspects: 'loadMaterialAspects',
      getCollectionAspects: 'loadCollectionAspects',
    }),
    colorSelected(value) {
      this.currentColorsAspects = value;
    },
    materialSelected(value) {
      this.currentMaterialsAspects = value;
    },
    collectionSelected(value) {
      this.currentCollectionAspects = value;
    },
    submit() {      
      this.$emit('aply-product-filter', { 
        filterPriceFrom: this.currentPriceFrom,
        filterPriceTo: this.currentPriceTo,
        filterCategoryId: this.currentCategoryId,
        filterColorsAspects: this.currentColorsAspects,
        filterMaterialsAspects: this.currentMaterialsAspects,
        filterCollectionAspects: this.currentCollectionAspects,
      });
    },    
    reset() {
      this.$emit('aply-product-filter', { 
        filterPriceFrom: 0,
        filterPriceTo: 0,
        filterCategoryId: 0,
        filterColorsAspects: [],
        filterMaterialsAspects: [],
        filterCollectionAspects: [],
      });
    },
    // eslint-disable-next-line no-unused-vars
    setCurrentProductParamsFromProps(val, oldVal) {
      this.currentPriceFrom = val.filterPriceFrom;
      this.currentPriceTo = val.filterPriceTo;
      this.currentCategoryId = val.filterCategoryId;
      this.currentColorsAspects = val.filterColorsAspects;     
      this.currentMaterialsAspects = val.filterMaterialsAspects;
      this.currentCollectionAspects = val.filterCollectionAspects;
    },
  },
 
};
</script>
