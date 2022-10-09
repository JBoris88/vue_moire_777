<template>
    <li class="cart__item product">

        <router-link class="product__pic" :to="{ name: 'product', params: {id: cartItem.productId} }">
            <img :src="cartItem.image" width="120" height="120" :srcset="scaleImage(cartItem.image)" :alt="cartItem.title">
        </router-link>

        <h3 class="product__title">
            {{cartItem.title}}
        </h3>

        <p class="product__info product__info--color">
            Цвет:
            <span>
                <i :style="'background-color:' + cartItem.color"></i>
                {{cartItem.colorTitle}}
            </span>

            Размер: {{cartItem.sizeTitle}}
        </p>

        <span class="product__code">
            Артикул: {{cartItem.partNumber}}
        </span>

        <product-counter v-model.number="quantity" :disabledAll="cartItemUpdating"/>

        <b class="product__price">
            {{ formattedItemTotalSum }}
        </b>

        <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteItem(cartItem.cartItemId)" :disabled="cartItemDeleting">
            <svg width="20" height="20" fill="currentColor">
                <use xlink:href="#icon-close"></use>
            </svg>
        </button>
    </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import requestHandler from '@/helpers/storageRequestHandler';
import { mapActions } from 'vuex';
import ProductCounter from '@/components/ProductCounter.vue';
import eventBus from '@/eventBus';

export default {
  components: { ProductCounter },
  props: ['cartItem'],
  data() {
    return {
      cartItemDeleting: false,
      cartItemUpdating: false,
    };
  },  
  computed: {
    formattedItemTotalSum() {
      return `${numberFormat(this.cartItem.itemTotalSum)} ₽`;
    },
    quantity: {
      get() {
        return this.cartItem.quantity;
      },
      set(value) {
        this.updateItemQuantity({ cartItemId: this.cartItem.cartItemId, quantity: value });
      },
    },    
  },
  methods: {
    ...mapActions({ 
      deleteCartItem: 'deleteCartItem', 
      updateCartItemQuantity: 'updateCartItemQuantity',
    }),
    scaleImage(image) {
      if (image !== '') {
        return `${image} 2x`;
      }
      return '';
    },
    deleteItem(value) {
      this.cartItemDeleting = true;
      requestHandler()
        .then(() => {
          this.deleteCartItem(value)
            .then((response) => {
              eventBus.$emit('cart-error', response);
            })      
            .finally(() => { this.cartItemDeleting = false; });
        });
    },
    updateItemQuantity(value) {
      this.cartItemUpdating = true;
      requestHandler()
        .then(() => {
          this.updateCartItemQuantity(value)
            .then((response) => {
              eventBus.$emit('cart-error', response);
            })      
            .finally(() => { this.cartItemUpdating = false; });
        });
    },
  },
};
</script>
