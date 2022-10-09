<template>
    <div v-if="errorMessage!==''">
        <div class="cart__error form__error-block">
            <h4>Похоже произошла ошибка.</h4>
            <p>
                {{errorMessage}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    formErrorMessage: {
      type: String,
      default: '',
    },
    formError: {
      type: Object,
      default() {
        return {};
      },
    },
  },    
  computed: {
    errorMessage() {
      return this.formError 
        ? Object.keys(this.formError).map((key) => this.formError[key]).reduce((acc, item) => `${acc} ${item}`, '') 
        : '';
    },
  },
};
</script>
