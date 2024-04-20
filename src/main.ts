import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import 'ant-design-vue/dist/reset.css';
import './style.css';

const vm = createApp(App);

vm.use(Antd);
vm.use(pinia);
vm.use(router);
vm.mount('#app');
