<template>
          <li class="catalog__item">

            <router-link class="catalog__pic" :to="{name: 'product', params: {id: productItem.id} }">
              <img :src="selectedImage" :alt="productItem.title">
              <!-- <img src="img/product-1.jpg" srcset="img/product-1@2x.jpg 2x" alt="Название товара"> -->
            </router-link>

            <h3 class="catalog__title">
              <router-link :to="{name: 'product', params: {id: productItem.id} }">
                {{ productItem.title }}
              </router-link>
            </h3>

            <span class="catalog__price">
              {{ formattedPrice }}
            </span>

            <base-color-radio-selector v-model="selectedColor" :colorsList="productItem.colorsOfProduct"/>

            <base-preloader-small v-if="productAddSending"/>
            <product-size-chip-selector 
              :sizeList="productItemSizes"
              @product-size-selected="addToCart"
              v-else-if="showSizes"
            />
            <button class="fstcrt__button button--fstcrt" @click.prevent="addProductSizes" v-else>
              В корзину
            </button>
          </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import requestHandler from '@/helpers/storageRequestHandler';
import BaseColorRadioSelector from '@/components/BaseColorRadioSelector.vue';
import ProductSizeChipSelector from '@/components/ProductSizeChipSelector.vue';
import BasePreloaderSmall from '@/components/BasePreloaderSmall.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { BaseColorRadioSelector, ProductSizeChipSelector, BasePreloaderSmall },
  props: {
    productItem: {
      type: Object,
      required: true,
    },
  }, 
  data() {
    return {
      selectedColor: 0,
      productAmount: 1,
      
      sizeSelector: false,
      productAddSending: false,

      formError: {},
      formErrorMessage: '',      
    };
  }, 
  computed: {
    ...mapGetters({ 
      getProductSizes: 'getProductSizes', 
    }),
    productItemSizes() {
      return this.getProductSizes.filter((x) => (x.productId === this.productItem.id));
    },
    formattedPrice() {
      return `${numberFormat(this.productItem.price)} ₽`;
    },
    selectedImage() {
      const selectedColorObject = this.productItem.colorsOfProduct.find((x) => x.id === this.selectedColor);
      return selectedColorObject ? selectedColorObject.image : '';
    },
    showSizes() {
      return (this.productItemSizes.length > 0) && (this.sizeSelector);
    },
  },
  created() {
    this.selectedColor = this.productItem.colorsOfProduct[0].id;
  },
  methods: {
    ...mapActions({
      loadProductSizes: 'loadProductSizes',
      addProductToCart: 'addProductToCart',      
    }),
    addProductSizes() {
      this.sizeSelector = true;
      this.loadProductSizes(this.productItem.id);
    },
    addToCart(value) {
      if (value > 0) {
        this.formError = {};
        this.productAddSending = true;
        requestHandler()
          .then(() => {
            this.addProductToCart({ 
              productId: this.productItem.id, 
              colorId: this.selectedColor, 
              sizeId: value, 
              amount: this.productAmount, 
            })
              .then((response) => {
                this.formError = response;
              })
              .finally(() => { 
                this.productAddSending = false; 
                this.productAmount = 1;
                this.sizeSelector = false;
              });
          });        
      }
    },    
  },  
};
</script>
