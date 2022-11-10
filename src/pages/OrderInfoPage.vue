<template>
  <main class="content container" v-if="orderInfoLoadingPreloader"><base-preloader/></main>
  <main class="content container" v-else-if="orderInfoLoadingFailed">Произошла ошибка при загрузке информации о заказе...<button @click.prevent="loadOrderInfo">Повторить</button></main>
  <main class="content container" v-else>
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

      <h1 class="content__title">
        Заказ оформлен <span>№ {{orderInfo.orderNumder}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа. 
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <base-dictionary-item keyf="Получатель" :value="orderInfo.name"/>
            <base-dictionary-item keyf="Адрес доставки" :value="orderInfo.address"/>
            <base-dictionary-item keyf="Телефон" :value="orderInfo.phone"/>
            <base-dictionary-item keyf="Email" :value="orderInfo.email"/>
            <base-dictionary-item keyf="Способ оплаты" :value="orderInfo.paymentType"/>
          </ul>
        </div>

        <order-cart-block :orderItems = "orderItems" :totalOrderItems="orderInfo.totalOrderItems" :totalOrderSum="orderInfo.totalOrderSum" :deliveryText="orderInfo.deliverySumText"/>
      </form>
    </section>
  </main>
</template>

<script>
import { API_PRELOADER_DELAY } from '@/config';
import requestHandler from '@/helpers/storageRequestHandler';
import { mapGetters, mapActions } from 'vuex';
import BasePreloader from '@/components/BasePreloader.vue';
import OrderCartBlock from '@/components/OrderCartBlock.vue';
import BaseDictionaryItem from '@/components/BaseDictionaryItem.vue';

export default {
  components: { 
    BasePreloader,
    BaseDictionaryItem,
    OrderCartBlock,
  },
  data() {
    return {
      orderInfoLoading: false,
      orderInfoLoadingFailed: false,

      orderInfoLoadingPreloader: false,
    };
  },  
  computed: {
    ...mapGetters({ 
      orderInfo: 'orderInfoDetail',
      orderItems: 'orderInfoDetailItems',
      orderLoading: 'orderStillLoading',      
    }),
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadOrderInfo();
      },
      immediate: true,
    },
    orderInfoLoading: {
      handler() {
        clearTimeout(this.orderInfoLoadingTimeout);

        if (this.orderInfoLoading === false) {
          this.orderInfoLoadingPreloader = false;
        } else {
          clearTimeout(this.orderInfoLoadingTimeout);
          this.orderInfoLoadingTimeout = setTimeout(() => {      
            this.orderInfoLoadingPreloader = true;     
          }, API_PRELOADER_DELAY);
        }
      },
      immediate: true,      
    },    
  },
  methods: {
    ...mapActions({ 
      loadOrder: 'loadOrder',
    }),
    loadOrderInfo() {
      const orderId = +(this.$route.params.id || 0);
      this.orderInfoLoading = true;
      this.orderInfoLoadingFailed = false;
      requestHandler()
        .then(() => {
          this.loadOrder(orderId)
            .catch(() => { this.orderInfoLoadingFailed = true; })
            .finally(() => { this.orderInfoLoading = false; });
        });      
    },    
  }, 
};
</script>
