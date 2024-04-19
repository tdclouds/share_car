import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import { register } from 'swiper/element/bundle';
import App from './App.vue';
import router from './router';
import pinia from './store';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import 'animate.css';
import 'swiper/css';
import 'swiper/element/css/autoplay';

register();

const vm = createApp(App);

vm.use(Antd);
vm.use(pinia);
vm.use(router);
vm.mount('#app');
