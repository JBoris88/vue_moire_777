<template>
    <li class="cart__order">
        <h3>{{ orderItem.title }}</h3>
        <b>{{ formattedItemTotalSum }}</b>
        <span>Артикул: <span>{{orderItem.partNumber}}</span></span>
    </li>  
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: {
    orderItem: {
      type: Object,
      required: true,
    },
  },  
  computed: {
    formattedItemTotalSum() {
      return `${numberFormat(this.orderItem.itemTotalSum)} ₽`;
    },
  },
};
</script>
