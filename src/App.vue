<script lang="ts" setup>
import { useDarkMode } from 'vue-hooks-plus';
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const [darkMode] = useDarkMode();
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
