<template>
    <base-preloader-small v-if="cartLoading()"/>
    <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}" v-else>
        <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
        <span class="header__count" aria-label="Количество товаров">{{cartPositions()}}</span>        
    </router-link>    
</template>

<script>
import { mapGetters } from 'vuex';
import BasePreloaderSmall from '@/components/BasePreloaderSmall.vue';

export default {
  components: { BasePreloaderSmall },
  methods: { ...mapGetters({ cartPositions: 'cartTotalPositionsNumber', cartLoading: 'cartStillLoading' }) },
};
</script>
