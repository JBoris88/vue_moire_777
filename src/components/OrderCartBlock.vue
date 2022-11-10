<template>
    <div class="cart__block">
    <slot name="preloader"></slot>
    <ul class="cart__orders">
    <order-item v-for="item in orderItems" :key="item.cartItemId" :orderItem="item"/>
    </ul>
    
    <div class="cart__total">
    <p>Доставка: <b>{{deliveryText}}</b></p>
    <p>Итого: <b>{{totalOrderItems}}</b> <span>{{productNumerator}}</span> на сумму <b><span>{{totalOrderSum | numberFormat}} ₽</span></b></p>
    </div>

    <slot/>
</div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import pluralize from '@/helpers/pluralize';
import OrderItem from '@/components/OrderItem.vue';

export default {
  components: { OrderItem },
  filters: { numberFormat },  
  props: {
    orderItems: {
      type: Array,
      required: true,
    },
    totalOrderItems: {
      type: Number,
      required: true,
    }, 
    totalOrderSum: {
      type: Number,
      required: true,
    },
    deliveryText: {
      type: String,
      default: '',
    },           
  },  
  computed: {
    productNumerator() {
      return `${pluralize(this.totalOrderItems, ['товар', 'товара', 'товаров'])}`;
    },
  },
};
</script>
