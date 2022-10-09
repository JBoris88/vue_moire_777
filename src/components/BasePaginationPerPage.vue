<template>
    <div class="item__row item__row_pp">
        <div>Выводить по:</div>
        <fieldset class="form__block form__block_pp"> 
            <label class="form__label form__label--small form__label--select">
                <select class="form__select" type="text" name="perpage" v-model.number="checkedPerPage">
                    <option :value="perPage" v-for="perPage in perPageVariants" :key="perPage">{{ perPage }}</option>
                </select>
            </label>
        </fieldset>  
    </div>
</template>

<script>
export default {
  props: {
    perPageVariants: {
      type: Array,
      required: true,
    },
    selectedPerPage: {
      type: Number,
      required: true,      
    },
  },
  computed: {
    checkedPerPage: {
      get() {
        return this.selectedPerPage;
      },
      set(value) {
        this.$emit('perpage-selected', value);
        return value;
      },
    },
  },  
};
</script>
