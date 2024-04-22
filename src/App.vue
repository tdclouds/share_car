<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useDarkMode } from 'vue-hooks-plus';
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { addClass, removeClass } from 'ant-design-vue/es/vc-util/Dom/class';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const [darkMode] = useDarkMode();

watch(darkMode, toggleDark);

function toggleDark(value: boolean) {
  const html = document.documentElement;
  if (value) {
    addClass(html, 'dark');
  } else {
    removeClass(html, 'dark');
  }
}

onMounted(() => {
  toggleDark(darkMode.value);
});
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <router-view></router-view>
  </a-config-provider>
</template>

<style scoped></style>
