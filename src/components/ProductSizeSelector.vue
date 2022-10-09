<template>
    <label class="form__label form__label--small form__label--select">
        <select class="form__select" type="text" name="category" v-model.number="dataSelectedSize">
            <option :value="cat.id" v-for="cat in sizeList" :key="cat.id">{{ cat.title }}</option>
        </select>
    </label>
</template>

<script>
export default {
  model: {
    prop: 'selectedSize',
    event: 'change',
  },  
  props: {
    selectedSize: {
      type: Number,
      default: 0,
    },
    sizeList: {
      type: Array,
      required: true,
    },
  },    
  computed: {
    dataSelectedSize: {
      get() {
        return this.selectedSize;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
  }, 
};
</script>
