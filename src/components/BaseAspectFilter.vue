<template>
    <fieldset class="form__block">
    <legend class="form__legend">{{aspectName}}</legend>
    <ul class="check-list">          
        <li class="check-list__item" v-for="aspect in aspectVariants" :key="aspect.id">
        <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox" :value="aspect.id" v-model="checkedAspects">
            <span class="check-list__desc">
            {{aspect.title}} 
            <span>({{aspect.productsCount}})</span>
            </span>
        </label>
        </li>
    </ul>
    </fieldset>
</template>

<script>
export default {
  props: {
    aspectName: {
      type: String,
      required: false,
      default: '',
    },
    aspectVariants: {
      type: Array,
      required: true,
    },
    selectedAspects: {
      type: Array,
      required: true,      
    },
  },
  computed: {
    checkedAspects: {
      get() {
        return this.selectedAspects;
      },
      set(value) {
        this.$emit('aspect-selected', value);
        return value;
      },
    },
  },
};
</script>
