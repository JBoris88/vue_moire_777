<template>
    <fieldset class="form__block">
    <legend class="form__legend">Цвет</legend>
        <ul class="colors">
            <li class="colors__item" v-for="color in colorVariants" :key="color.id">
                <label class="colors__label">
                  <input class="colors__check sr-only" type="checkbox" :value="color.id" v-model="checkedColors">
                  <span class="colors__value" :style="'background-color:' + color.color">
                  </span>                  
                </label>
            </li>
        </ul>
    </fieldset>  
</template>

<script>
export default {
  props: {
    colorVariants: {
      type: Array,
      required: true,
    },
    selectedColors: {
      type: Array,
      required: true,      
    },    
  },
  computed: {
    checkedColors: {
      get() {
        return this.selectedColors;
      },
      set(value) {
        this.$emit('colors-aspect-selected', value);
        return value;
      },
    },
  },  
};
</script>
