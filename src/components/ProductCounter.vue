<template>
    <div class="form__counter">
        <button type="button" aria-label="Убрать один товар" :disabled="(currAmount <= 1) || disabledAll" @click="decrCnt()">
            <svg width="12" height="12" fill="currentColor">
            <use xlink:href="#icon-minus"></use>
            </svg>
        </button>

        <input type="text" v-model.number="currAmount" name="count" :disabled="disabledAll">

        <button type="button" aria-label="Добавить один товар" :disabled="disabledAll" @click="incrCnt()">
            <svg width="12" height="12" fill="currentColor">
            <use xlink:href="#icon-plus"></use>
            </svg>
        </button>
    </div>

</template>

<script>
export default ({
  model: {
    prop: 'amount',
    event: 'amount-change',
  },
  props: {
    amount: {
      type: Number,
      required: true,
      validator(value) {
        return (value > 0);
      },
    },
    disabledAll: {
      type: Boolean,
      default: false,
    },
  }, 
  computed: {
    currAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        if (+value < 1) { 
          this.$emit('amount-change', 1);
        } else {
          this.$emit('amount-change', value);
        }        
      },
    },
  }, 
  methods: {
    incrCnt() {
      this.currAmount += 1;
    },
    decrCnt() {
      if (this.amount > 1) {
        this.currAmount -= 1;
      }
    },     
  },
});
</script>
