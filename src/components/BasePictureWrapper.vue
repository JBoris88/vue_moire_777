<template>
    <div class="item__pics pics">
    <div class="pics__wrapper">
        <img width="570" height="570" :src="selectedImage" :srcset="scaleImage(selectedImage)" :alt="pictureCommonTitle">
    </div>
    <ul class="pics__list">
        <li class="pics__item" v-for="pictureElement in pictureList" :key="pictureElement.id">
            <a href="" class="pics__link" :class="{'pics__link--current': pictureElement.id===picture}" @click.prevent="selectThisPic(pictureElement.id)" @keyup.prevent="selectThisPic(pictureElement.id)">
                <img width="98" height="98" :src="pictureElement.image" :srcset="scaleImage(pictureElement.image)" :alt="pictureCommonTitle">
            </a>
        </li>
    </ul>
    </div>
</template>

<script>
export default {
  model: {
    prop: 'picture',
    event: 'selectPicture',
  },    
  props: {
    picture: {
      type: Number,
      default: 0,
    },
    pictureCommonTitle: {
      type: String,
      default: '',
    },    
    pictureList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    selectedImage() {
      const selectedPictureObject = this.pictureList.find((x) => x.id === this.picture);
      return selectedPictureObject ? selectedPictureObject.image : '';
    },
  },
  methods: {
    selectThisPic(id) {
      this.$emit('selectPicture', id);
    },    
    scaleImage(image) {
      if (image !== '') {
        return `${image} 2x`;
      }

      return '';
    },
  },
};
</script>
