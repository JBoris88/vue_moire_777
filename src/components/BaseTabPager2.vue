<template>
      <div class="item__desc">
        <base-tabs>
            <base-tab v-for="tabElement in tabElements" :key="tabElement.title" 
                :title="tabElement.title"
                :content="tabElement.ContentElements">
                <template v-slot:default="slotProps">
                <div v-for="cnt in slotProps.currentContent" :key="cnt.title">
                    <h3>{{cnt.title}}</h3>
                    <p>
                        <template v-for="row in cnt.rows">
                            {{row}}
                            <br v-bind:key="row">
                        </template>
                    </p>
                </div>
                </template>
            {{tabElement.title}}
            </base-tab>
        </base-tabs>
      </div>
</template>

<script>
import BaseTab from '@/components/BaseTab.vue';
import BaseTabs from '@/components/BaseTabs.vue';

export default {
  components: {
    BaseTab,
    BaseTabs, 
  },     
  props: {
    tabElements: {
      type: Array,
      required: true,
    },
  },   
};
</script>
