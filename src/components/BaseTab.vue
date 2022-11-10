<template>
  <div class="item__content" v-show="isActive">
    <slot v-bind:currentContent="content"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Tab',
    },
    content: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
};
</script>
