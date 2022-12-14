<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="orderTheseItems">
        <div class="cart__field">
          <div class="cart__data">
            <base-form-text v-model="formData.name" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя"/>

            <base-form-text v-model="formData.address" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес"/>

            <base-form-phone v-model="formData.phone" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон"/>

            <base-form-text v-model="formData.email" :error="formError.email" title="Email" placeholder="Введи ваш Email" type="email"/>

            <base-form-textarea v-model="formData.comment" :error="formError.comment" title="Комментарий к заказу" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <base-option-selector v-model="selectedDelivery" :optionItemsList="deliveryTypes"/>
            <h3 class="cart__title">Оплата</h3>
            <base-option-selector v-model="selectedPayment" :optionItemsList="paymentTypes"/>         
          </div>
        </div>

        <order-cart-block :orderItems = "orderItems" :totalOrderItems="totalOrderItems" :totalOrderSum="totalOrderSum" :deliveryText="deliverySumText">
          <template v-slot:preloader>
            <base-preloader v-if="cartStillLoadingPreloader"/>
          </template>

           <button class="cart__button button button--primery" type="submit" :disabled="orderCreationButtonDisabled">
            <base-preloader-small v-show="orderCreationPreloader"/>
            Оформить заказ
          </button>         
        </order-cart-block>

        <div class="cart__error form__error-block"  v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{formErrorMessage}}
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { API_PRELOADER_DELAY, API_SMALLPRELOADER_DELAY } from '@/config';
import requestHandler from '@/helpers/storageRequestHandler';
import { mapGetters, mapActions } from 'vuex';
import BasePreloaderSmall from '@/components/BasePreloaderSmall.vue';
import BasePreloader from '@/components/BasePreloader.vue';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import BaseFormPhone from '@/components/BaseFormPhone.vue';
import OrderCartBlock from '@/components/OrderCartBlock.vue';
import BaseOptionSelector from '@/components/BaseOptionSelector.vue';

export default {
  components: {
    BasePreloaderSmall,
    BasePreloader,
    BaseFormText, 
    BaseFormTextarea,
    BaseFormPhone,
    OrderCartBlock,
    BaseOptionSelector,    
  },
  data() {
    return {
      formData: {},

      selectedDelivery: 0,
      selectedPayment: 0,

      orderCreation: false,
      orderCreationPreloader: false,

      cartStillLoadingPreloader: false,

      orderOptions: [{
        delivery: 0,
        payment: 0,
      }],
    };
  },
  computed: {
    ...mapGetters({ 
      orderItems: 'cartItems', 
      totalOrderItemsSum: 'cartTotalSum', 
      totalOrderItems: 'cartTotalPositionsNumber',
      deliveryTypes: 'deliveryTypes',
      paymentTypes: 'paymentTypes',
      formError: 'getOrderCreationError',
      formErrorMessage: 'getOrderCreationErrorMessage',
      cartStillLoading: 'cartStillLoading',
    }),
    totalOrderSum() {
      return this.totalOrderItemsSum + this.deliverySum;
    },
    deliverySum() {
      const selectedDeliveryObject = this.deliveryTypes.find((x) => x.id === this.selectedDelivery);
      return selectedDeliveryObject ? +selectedDeliveryObject.price : 0;
    },
    deliverySumText() {
      const selectedDeliveryObject = this.deliveryTypes.find((x) => x.id === this.selectedDelivery);
      return selectedDeliveryObject ? selectedDeliveryObject.title2 : '';  
    },
    orderCreationButtonDisabled() {
      return !(this.selectedDelivery > 0) || !(this.selectedPayment > 0) || this.orderCreation;
    },
  },
  created() {
    this.selectedDelivery = 0;
    this.loadDeliveryTypes();
  },
  watch: {  
    selectedDelivery: {
      handler() {
        const orderOption = this.orderOptions.find((x) => x.delivery === this.selectedDelivery);
        this.selectedPayment = orderOption ? orderOption.payment : 0;
        this.loadPaymentTypes(this.selectedDelivery);
      },
      immediate: true,      
    },
    selectedPayment: {
      handler() {
        this.orderOptions = this.orderOptions.filter((f) => (f.delivery !== this.selectedDelivery));
        this.orderOptions.push({
          delivery: this.selectedDelivery,
          payment: this.selectedPayment,
        });
        this.loadPaymentTypes(this.selectedDelivery);
      },
      immediate: true,      
    },  
    orderCreation: {
      handler() {
        clearTimeout(this.orderCreationTimeout);

        if (this.orderCreation === false) {
          this.orderCreationPreloader = false;
        } else {
          clearTimeout(this.orderCreationTimeout);
          this.orderCreationTimeout = setTimeout(() => {      
            this.orderCreationPreloader = true;     
          }, API_SMALLPRELOADER_DELAY);
        }
      },
      immediate: true,      
    },
    cartStillLoading: {
      handler() {
        clearTimeout(this.cartStillLoadingTimeout);

        if (this.cartStillLoading === false) {
          this.cartStillLoadingPreloader = false;
        } else {
          clearTimeout(this.cartStillLoadingTimeout);
          this.cartStillLoadingTimeout = setTimeout(() => {      
            this.cartStillLoadingPreloader = true;     
          }, API_PRELOADER_DELAY);
        }
      },
      immediate: true,      
    },    
  },  
  methods: {
    ...mapActions({ 
      loadDeliveryTypes: 'loadDeliveryTypes',
      loadPaymentTypes: 'loadPaymentTypes',
      createOrder: 'createOrder',
    }),
    orderTheseItems() {
      this.orderCreation = true;
      requestHandler()
        .then(() => {
          this.createOrder({
            ...this.formData,
            deliveryTypeId: this.selectedDelivery,
            paymentTypeId: this.selectedPayment,
          }).then((response) => { 
            const currentOrderId = response;
            if (currentOrderId > 0) {
              this.$router.push({ name: 'orderInfo', params: { id: currentOrderId } });
            }        
          })
            .finally(() => { this.orderCreation = false; });
        });
    },
  },
};
</script>
