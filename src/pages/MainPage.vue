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
        :productFiltered ="filterApplied" 
        @aply-product-filter="applyProductFilter"/>

      <section class="catalog">
        <base-preloader v-if="productsLoadingPreloader"/>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке списка товаров...<button @click.prevent="loadProducts">Повторить</button> </div>

        <product-list :products="products"/>
        <base-pagination v-model="currentPage" :count="countProducts" :perPage="productsPerPage"/>

      </section>
    </div>
  </main>
</template>

<script>
import { API_PRELOADER_DELAY } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import pluralize from '@/helpers/pluralize';
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
      filterApplied: false,

      productsLoading: false,
      productsLoadingFailed: false,

      productsLoadingPreloader: false,
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
      return `${numberFormat(this.countProducts)} ${pluralize(this.countProducts, ['товар', 'товара', 'товаров'])}`;
    },
    filterSignable() {
      return (this.filterProductParams.filterPriceFrom > 0 
                  || this.filterProductParams.filterPriceTo > 0
                  || this.filterProductParams.filterCategoryId > 0
                  || this.filterProductParams.filterColorsAspects.length > 0
                  || this.filterProductParams.filterMaterialsAspects.length > 0
                  || this.filterProductParams.filterCollectionAspects.length > 0);
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
    productsLoading: {
      handler() {
        clearTimeout(this.productsLoadingTimeout);

        if (this.productsLoading === false) {
          this.productsLoadingPreloader = false;
        } else {
          clearTimeout(this.productsLoadingTimeout);
          this.productsLoadingTimeout = setTimeout(() => {      
            this.productsLoadingPreloader = true;     
          }, API_PRELOADER_DELAY);
        }
      },
      immediate: true,      
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
      this.filterApplied = false;

      requestHandler()
        .then(() => {
          this.loadCatalogProducts({ ...this.filterProductParams, currentPage: this.currentPage, productsPerPage: this.productsPerPage })      
            .then(() => { 
              if (this.filterSignable) {
                this.filterApplied = true; 
              }
            })
            .catch(() => { 
              this.productsLoadingFailed = true; 
            })
            .finally(() => { this.productsLoading = false; });
        });
    },
  },
};
</script>
