<template>
  <base-form-field :title="title" :error="error">
    <masked-input 
      type="text"
      name="phone"
      class="form__input"
      v-model="dataValue"
      :mask="['+','7','(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]"
      :guide="true"
      :keepCharPositions="true"
      :showMask="false"
      placeholderChar="_"
      :placeholder="placeholder"
    >
    </masked-input>
  </base-form-field>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';
import MaskedInput from 'vue-text-mask';

export default {
  mixins: [formFieldMixin],
  components: {
    MaskedInput,
  },
  data() {
    return {
      phone: '',
    };
  },
};
</script>
