<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ productNumerator }}
        </span>

        <base-pagination-per-page 
          :selectedPerPage="productsPerPage" 
          :perPageVariants="catalogProductsPerPageVariants"
          @perpage-selected="productsPerPageSelected"/>        
      </div>
    </div>

    <div class="content__catalog">      
      <product-filter 
        :productParams="filterProductParams" 
        @aply-product-filter="applyProductFilter"/>

      <section class="catalog">
        <base-preloader v-if="productsLoading"/>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке списка товаров...<button @click.prevent="loadProducts">Повторить</button> </div>

        <product-list :products="products"/>
        <base-pagination v-model="currentPage" :count="countProducts" :perPage="productsPerPage"/>

      </section>
    </div>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import decOfNum from '@/helpers/decOfNum';
import requestHandler from '@/helpers/storageRequestHandler';
import { mapGetters, mapActions } from 'vuex';
import BasePagination from '@/components/BasePagination.vue';
import BasePreloader from '@/components/BasePreloader.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import ProductList from '@/components/ProductList.vue';
import BasePaginationPerPage from '@/components/BasePaginationPerPage.vue';

export default {
  components: {
    BasePagination,
    BasePreloader,
    ProductFilter,
    ProductList,
    BasePaginationPerPage,
  },
  data() {
    return {
      currentPage: 1,
      productsPerPage: 0,

      filterProductParams: {
        filterPriceFrom: 0,
        filterPriceTo: 0,
        filterCategoryId: 0,
        filterColorsAspects: [],      
        filterMaterialsAspects: [],
        filterCollectionAspects: [],
      },

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    ...mapGetters({ 
      countProducts: 'countCatalogProducts',
      products: 'catalogProducts',
      catalogProductsPerPageVariants: 'catalogProductsPerPageVariants',
      catalogProductsPerPageDafault: 'catalogProductsPerPageDafault',
    }),    
    productNumerator() {
      return `${numberFormat(this.countProducts)} ${decOfNum(this.countProducts, ['товар', 'товара', 'товаров'])}`;
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        const categoryId = this.$route.params.id;
        if (categoryId > 0) {
          this.filterProductParams.filterCategoryId = categoryId;
        }
      },
      immediate: true,
    },    
    currentPage() {
      this.loadProducts();
    },
  },
  created() {
    this.productsPerPage = this.catalogProductsPerPageDafault;
    this.loadProducts();
  },  
  methods: {
    ...mapActions({ loadCatalogProducts: 'loadCatalogProducts' }),
    productsPerPageSelected(value) {
      this.productsPerPage = value;
      this.currentPage = 1;
      this.loadProducts();
    },    
    applyProductFilter(newFilterValue) {
      this.filterProductParams = newFilterValue;
      this.currentPage = 1;
      this.loadProducts();
    },
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      requestHandler()
        .then(() => {
          this.loadCatalogProducts({ ...this.filterProductParams, currentPage: this.currentPage, productsPerPage: this.productsPerPage })      
            .catch(() => { this.productsLoadingFailed = true; })
            .finally(() => { this.productsLoading = false; });
        });
    },
  },
};
</script>
