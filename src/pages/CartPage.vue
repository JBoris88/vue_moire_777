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
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ productNumerator }}
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <cart-item v-for="cartItem in cartItems" :key="cartItem.cartItemId" :cartItem="cartItem"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ formattedTotalSum }}</span>
          </p>

          <router-link class="cart__button button button--primery" :to="{name: 'order'}" tag="button" :disabled="disabledOrderButton">
            Оформить заказ
          </router-link>          
        </div>

        <base-error-block :formErrorMessage="formErrorMessage" :formError="formError"/>

      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import decOfNum from '@/helpers/decOfNum';
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import BaseErrorBlock from '@/components/BaseErrorBlock.vue';
import eventBus from '@/eventBus';

export default {
  components: { CartItem, BaseErrorBlock },
  data() {
    return {
      formError: {},
      formErrorMessage: '',
    };
  },  
  computed: {
    ...mapGetters({ 
      cartItems: 'cartItems', 
      totalSum: 'cartTotalSum', 
      countProducts: 'cartTotalPositionsNumber',
    }),    
    productNumerator() {
      return `${numberFormat(this.countProducts)} ${decOfNum(this.countProducts, ['товар', 'товара', 'товаров'])}`;
    },
    formattedTotalSum() {
      return `${numberFormat(this.totalSum)} ₽`;
    },
    disabledOrderButton() {
      return (this.totalProducts <= 0);
    },
  },
  created() {
    eventBus.$on('cart-error', (val) => {
      this.formError = val || {};
    });
  },
};
</script>
