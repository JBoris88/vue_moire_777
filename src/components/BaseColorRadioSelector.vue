<template>
    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in colorsList" :key="color.id">
        <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" :value="color.id" v-model="dataSelectedColor">
            <span class="colors__value" :style="'background-color:' + color.color">
            </span>
        </label>
      </li>
    </ul>
</template>

<script>
export default {
  model: {
    prop: 'selectedColor',
    event: 'change',
  },  
  props: {
    selectedColor: {
      type: Number,
      default: 0,
    },
    colorsList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dataSelectedColor: {
      get() {
        return this.selectedColor;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
  },  
};
</script>
