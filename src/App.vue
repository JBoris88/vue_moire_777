<template>
<div>
  <header class="header container">
    <div class="header__wrapper">
      <span class="header__info">Каталог</span>

      <a class="header__logo" href="#">
        <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
      </a>

      <a class="header__tel" :href="'tel:' + contactPhone">
        {{contactPhone}}
      </a>

      <cart-indicator/> 
    </div>
  </header>

  <router-view/>

  <footer class="footer container">
    <div class="footer__wrapper">
      <ul class="footer__links">
        <li>
          <a class="footer__link" href="#"  @click.prevent="$router.push({name: 'main'}).catch(() => {})">
            Каталог
          </a>
        </li>
        <li>
          <a class="footer__link" :href="'tel:' + contactPhone">
            {{contactPhone}}
          </a>
        </li>
        <li>
          <a class="footer__link" :href="'mailto:' + contactEmail">
            {{contactEmail}}
          </a>
        </li>
        <li>
          <a class="footer__link" href="#" @click.prevent="$router.push({name: 'sale'}).catch(() => {})">
            Распродажа
          </a>
        </li>
        <li>
          <a class="footer__link footer__link--medium" href="#"  @click.prevent="$router.push({name: 'orderCallback'}).catch(() => {})">
            Заказать звонок
          </a>
        </li>
      </ul>

      <ul class="footer__social social">
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Вконтакте">
            <svg width="20" height="11" fill="currentColor">
              <use xlink:href="#icon-vk"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Инстаграм">
            <svg width="17" height="17" fill="currentColor">
              <use xlink:href="#icon-insta"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Facebook">
            <svg width="17" height="17" fill="currentColor">
              <use xlink:href="#icon-facebook"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Twitter">
            <svg width="17" height="14" fill="currentColor">
              <use xlink:href="#icon-twitter"></use>
            </svg>
          </a>
        </li>
        <li class="social__item">
          <a class="social__link" href="#" aria-label="Telegram">
            <svg width="19" height="17" fill="currentColor">
              <use xlink:href="#icon-telegram"></use>
            </svg>
          </a>
        </li>
      </ul>

      <p class="footer__desc">
        Все права на&nbsp;материалы, находящиеся на&nbsp;сайте, охраняются в&nbsp;соответствии с&nbsp;законодательством&nbsp;РФ, 
        в&nbsp;том числе об&nbsp;авторском праве и&nbsp;смежных правах.
      </p>
      
      <ul class="footer__data">
        <li>
          <a class="footer__link" href="#" target="_blank" rel="noopener" type="application/pdf">
            Политика конфиденциальности
          </a>
        </li>
        <li>
          <a class="footer__link" href="#" target="_blank" rel="noopener" type="application/pdf">
            Публичная оферта
          </a>
        </li>
      </ul>

      <span class="footer__copyright">
        © 2022 Moire
      </span>
    </div>
  </footer>  
</div>
</template>

<script>
import requestHandler from '@/helpers/storageRequestHandler';
import { mapActions, mapMutations } from 'vuex';
import CartIndicator from '@/components/CartIndicator.vue';

export default {
  name: 'App',
  components: { CartIndicator },
  data() {
    return {
      contactEmail: 'hi@moire.com',
      contactPhone: '8 800 600 90 09',
    };
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),    
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    requestHandler()
      .then(() => {
        this.loadCart();
      });    
  },
};
</script>
