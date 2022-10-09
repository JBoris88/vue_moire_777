<template>
    <ul class="cart__options options">
        <li class="options__item" v-for="optionItem in optionItemsList" :key="optionItem.id">
        <label class="options__label">
            <input class="options__radio sr-only" type="radio" :value="optionItem.id" v-model="dataSelectedOption">
            <span class="options__value">
                {{optionItem.title}} <b v-if="optionItem.title2">{{optionItem.title2}}</b>
            </span>
        </label>
        </li>
    </ul>  
</template>

<script>
export default {
  model: {
    prop: 'selectedOption',
    event: 'change',
  },
  props: {
    selectedOption: {
      type: Number,
      default: 0,
    },
    optionItemsList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dataSelectedOption: {
      get() {
        return this.selectedOption;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
  },  
};
</script>
