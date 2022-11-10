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

            <base-preloader v-if="productAddSendingPreloader"/>
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
import { API_PRELOADER_DELAY } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import requestHandler from '@/helpers/storageRequestHandler';
import BaseColorRadioSelector from '@/components/BaseColorRadioSelector.vue';
import ProductSizeChipSelector from '@/components/ProductSizeChipSelector.vue';
import BasePreloader from '@/components/BasePreloader.vue';
import { mapGetters, mapActions } from 'vuex';
import { DialogToast } from 'v-dialogs';

export default {
  components: { BaseColorRadioSelector, ProductSizeChipSelector, BasePreloader },
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

      productAddSendingPreloader: false,

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
  watch: {
    productAddSending: {
      handler() {
        clearTimeout(this.productAddSendingTimeout);

        if (this.productAddSending === false) {
          this.productAddSendingPreloader = false;
        } else {
          clearTimeout(this.productAddSendingTimeout);
          this.productAddSendingTimeout = setTimeout(() => {      
            this.productAddSendingPreloader = true;     
          }, API_PRELOADER_DELAY);
        }
      },
      immediate: true,      
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
                if (Object.keys(response).length === 0 && response.constructor === Object) {
                  DialogToast('Товар добавлен в корзину', {
                    title: '',
                    messageType: 'success',
                    closeTime: 3,
                    position: 'topCenter',
                    icon: false,                  
                  });
                } else {
                  DialogToast('Ошибка добавления товара', {
                    title: '',
                    messageType: 'error',
                    closeTime: 3,
                    position: 'topCenter',
                    icon: false,                  
                  });
                }
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
