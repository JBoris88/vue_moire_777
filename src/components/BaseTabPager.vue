<template>

      <div class="item__desc">
        <ul class="tabs">
          <li v-for="tab in tabs" :key="tab.name">
            <a href="#" class="tabs__link" :class="{'tabs__link--current': (currentTab.name === tab.name)}" @click.prevent="currentTab = tab">
              {{tab.name}}
            </a>
          </li>
        </ul>

        <keep-alive>
            <component v-bind:is="currentTab.component"/>
        </keep-alive>
      </div>
</template>

<script>

function getTemplate(contentElements) { 
  let index;
  let rowindex;
  let rez = '<div class="item__content">';
    
  if (contentElements) {
    for (index = 0; index < contentElements.length; index += 1) {
      const val = contentElements[index];
      if (val.title) rez = `${rez}<h3>${val.title}:</h3>`;
      if (val.rows) {
        rez = `${rez}<p>`;
        for (rowindex = 0; rowindex < val.rows.length; rowindex += 1) {
          rez = `${rez} ${val.rows[rowindex]}<br>`;
        }
        rez = `${rez}</p>`;
      }
    }
  }
  rez = `${rez}</div>`;
  return rez;
}

export default {
  props: {
    tabElements: {
      type: Array,
      required: true,
    },
  },  
  data() {
    return {
      currentTab: {},
    };
  },
  computed: {
    tabs() {
      return this.tabElements ? this.tabElements.map((x) => ({
        name: x.title,
        component: {
          template: getTemplate(x.ContentElements),
        },
      })) : [];
    },
  },
  created() {
    const i = 0;
    if (this.tabs[i]) {
      this.currentTab = this.tabs[i];
    } else {
      this.currentTab = {};
    }    
  },   
};
</script>
