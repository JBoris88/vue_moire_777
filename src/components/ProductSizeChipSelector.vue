<template>
<div>
  <span>Выберите размер</span>
  <div class="size_chip__items" v-if="sizeList.length > 0">
    <div class="chip_item" v-for="cat in sizeList" :key="cat.id">
            <button class="chip" type="button" :aria-label="cat.title" @click.prevent="applySelectedSize(cat.id)">
              {{ cat.title }}
            </button>
    </div>
  </div>
</div>
</template>

<script>
export default { 
  props: {
    sizeList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    applySelectedSize(value) {
      this.$emit('product-size-selected', value);
    },
  },
};
</script>
