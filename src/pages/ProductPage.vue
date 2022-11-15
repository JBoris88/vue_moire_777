<template>
  <main class="content container" v-if="productDetailLoadingPreloader"><base-preloader/></main>
  <main class="content container" v-else-if="productDetailLoadingFailed">Произошла ошибка при загрузке информации о товаре...<button @click.prevent="loadProduct">Повторить</button></main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
            <a class="breadcrumbs__link" href="#" @click.prevent="$router.push({name: 'main', params: { id: product.categoryId } })">
            {{ product.categoryTitle }}
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <base-picture-wrapper v-model="selectedColor" :pictureList="detailProductColors" :pictureCommonTitle="product.title"/>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.partNumber}}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>

        <base-error-block :formErrorMessage="formErrorMessage" :formError="formError"/>

        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <product-counter v-model.number="productAmount"/>              
              <b class="item__price">
                {{ formattedPrice }}
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <base-color-radio-selector v-model="selectedColor" :colorsList="detailProductColors"/>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <product-size-selector v-model="selectedSize" :sizeList="detailProductSizes"/>
              </fieldset>
            </div>
            
            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              <base-preloader-small v-if="productAddSendingPreloader"/>
              {{cartProductValue}}
            </button>

          </form>
        </div>
      </div>

      <base-tab-pager-2 :tabElements="productDescriptions"/>     
    </section>
  </main>
</template>

<script>
import { API_PRELOADER_DELAY, API_SMALLPRELOADER_DELAY } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import requestHandler from '@/helpers/storageRequestHandler';
import { mapGetters, mapActions } from 'vuex';
import BasePreloader from '@/components/BasePreloader.vue';
import ProductCounter from '@/components/ProductCounter.vue';
import BaseColorRadioSelector from '@/components/BaseColorRadioSelector.vue';
import ProductSizeSelector from '@/components/ProductSizeSelector.vue';
import BasePictureWrapper from '@/components/BasePictureWrapper.vue';
import BaseTabPager2 from '@/components/BaseTabPager2.vue';
import BaseErrorBlock from '@/components/BaseErrorBlock.vue';
import BasePreloaderSmall from '@/components/BasePreloaderSmall.vue';

export default {
  components: {
    BasePreloader,
    ProductCounter, 
    BaseColorRadioSelector, 
    ProductSizeSelector, 
    BasePictureWrapper,
    BaseTabPager2,
    BaseErrorBlock,
    BasePreloaderSmall,
  }, 
  data() {
    return {
      productAmount: 1,
      selectedColor: 0,
      selectedSize: 0,

      productDetailLoading: false,
      productDetailLoadingFailed: false,

      productDetailLoadingPreloader: false,

      productAddSending: false,

      productAddSendingPreloader: false,

      formError: {},
      formErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters({ 
      product: 'detailProduct',
      detailProductColors: 'detailProductColors',
      detailProductSizes: 'detailProductSizes',
      defaultColor: 'detailProductDefaultColor',
      defaultSize: 'detailProductDefaultSize',

      cartItems: 'cartItems',      
    }),    

    formattedPrice() {
      return `${numberFormat(this.product.price * this.productAmount)} ₽`;
    },
    cartProductValue() {
      const item = (this.cartItems || []).find((x) => (x.productId === this.product.id) && (x.colorId === this.selectedColor) && (x.sizeId === this.selectedSize));
      if (item) {
        return `Добавить к ${item.quantity}`;
      }

      return 'В корзину';
    },
    productDescriptions() {
      return this.product.productDescriptions ?? [];
    },
  },  
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct(); 
      },
      immediate: true,
    },
    defaultColor: {
      handler() {
        this.selectedColor = this.defaultColor;
      },
      immediate: true,      
    },
    defaultSize: {
      handler() {
        this.selectedSize = this.defaultSize;
      },
      immediate: true,      
    },
    productAddSending: {
      handler() {
        clearTimeout(this.productAddSendingTimeout);

        if (this.productAddSending === false) {
          this.productAddSendingPreloader = false;
        } else {
          clearTimeout(this.productAddSendingTimeout);
          this.productAddSendingTimeout = setTimeout(() => {      
            this.productAddSendingPreloader = true;     
          }, API_SMALLPRELOADER_DELAY);
        }
      },
      immediate: true,      
    },
    productDetailLoading: {
      handler() {
        clearTimeout(this.productDetailLoadingTimeout);

        if (this.productDetailLoading === false) {
          this.productDetailLoadingPreloader = false;
        } else {
          clearTimeout(this.productDetailLoadingTimeout);
          this.productDetailLoadingTimeout = setTimeout(() => {      
            this.productDetailLoadingPreloader = true;     
          }, API_PRELOADER_DELAY);
        }
      },
      immediate: true,      
    },     
  },  
  methods: {
    ...mapActions({ 
      loadDetailProduct: 'loadDetailProduct',
      addProductToCart: 'addProductToCart',
    }),
    addToCart() {
      this.formError = {};
      this.productAddSending = true;
      requestHandler()
        .then(() => {
          this.addProductToCart({ 
            productId: this.product.id, 
            colorId: this.selectedColor, 
            sizeId: this.selectedSize, 
            amount: this.productAmount, 
          })
            .then((response) => {
              this.formError = response;
            })
            .finally(() => { 
              this.productAddSending = false; 
              this.productAmount = 1;
            });
        });
    },
    loadProduct() {
      const productId = +(this.$route.params.id || 0);
      this.productDetailLoading = true;
      this.productDetailLoadingFailed = false;
      requestHandler()
        .then(() => {
          this.loadDetailProduct(productId)      
            .catch(() => { this.productDetailLoadingFailed = true; })
            .finally(() => { this.productDetailLoading = false; });
        });      
    },    
  },  
};
</script>
