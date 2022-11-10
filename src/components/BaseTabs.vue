<template>
  <div>
    <ul class="tabs">
        <li v-for="(tab, index) in tabs" :key="tab.title">
        <a href="#" class="tabs__link" :class="{'tabs__link--current': (index == selectedIndex)}" @click.prevent="selectTab(index)">
            {{tab.title}}
        </a>
        </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIndex: 0,
      tabs: [],
    };
  },
  created() {
    this.tabs = this.$children;
  },

  mounted() {
    this.selectTab(0);
  },
  methods: {
    selectTab(i) {
      this.selectedIndex = i;
      // eslint-disable-next-line no-param-reassign
      this.tabs.forEach((tab, index) => { tab.isActive = (index === i); });
    },
  },
};
</script>
