<template>
  <ul class="catalog__list">
    <ProductItem v-for="product in products" :key="product.id" :productItem="product"></ProductItem>
  </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  components: { ProductItem },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },  
};
</script>
