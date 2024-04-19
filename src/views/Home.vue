<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useDarkMode, useScroll } from 'vue-hooks-plus';
import { BulbOutlined, CodeOutlined } from '@ant-design/icons-vue';
import HomeBackground from '@/components/HomeBackground.vue';
import { BASE_URL } from '@/config';
import { useUserStore } from '@/store/user.ts';

const userStore = useUserStore();
const redirectUrl = BASE_URL + '/auth/github/redirect';

const scroll = useScroll();

const [darkMode] = useDarkMode();

const headerStyle = reactive({
  backgroundColor: 'transparent',
});

const backgroundColor = computed(() => {
  return darkMode.value ? '#111827' : '#ffffff';
});

watch(scroll, (value) => {
  headerStyle.backgroundColor =
    value !== undefined && value.top > 0
      ? backgroundColor.value
      : 'transparent';
});

const userInfo = computed(() => {
  return userStore.userInfo;
});

const logout = userStore.logout;
</script>

<template>
  <a-layout class="home bg-transparent">
    <a-layout-header
      :style="headerStyle"
      class="flex items-center justify-between w-full z-10 fixed transition"
    >
      <img alt="" src="" />

      <a v-if="!userInfo.account_id" :href="redirectUrl" target="_self">
        <a-button type="dashed">登录</a-button>
      </a>
      <template v-else>
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            {{ userInfo.nick_name }}
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>个人中心</a-menu-item>
              <a-menu-item>我的车票</a-menu-item>
              <a-menu-item>我的订单</a-menu-item>
              <a-menu-item @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-layout-header>
    <a-layout-content class="dark:text-white">
      <HomeBackground />

      <div
        class="mt-16 p-14 flex items-center justify-between lg:flex-col lg:justify-center flex-wrap z-10 overflow-hidden py-14"
      >
        <div
          class="font-medium mr-20 lg:mr-0 lg:text-center lg:mb-5 min-w-96 wow animate__slideInLeft bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-12"
        >
          <h2 class="text-7xl lg:text-4xl">TD Copilot Car</h2>
          <p class="mt-5 mb-5">
            我们提供智能、高效的开发工具，帮助开发者更快速、更便捷地完成项目。
          </p>
          <a-button type="primary">立即体验</a-button>
        </div>
        <div class="flex items-start">
          <img
            alt=""
            class="w-[165px] wow animate__slideInDown mr-5 mt-12"
            src="@/assets/images/h1.png"
          />
          <img
            alt=""
            class="w-[180px] wow animate__slideInUp mr-5 mt-32"
            src="@/assets/images/h2.png"
          />
          <img
            alt=""
            class="w-[105px] wow animate__slideInDown mt-5"
            src="@/assets/images/h3.png"
          />
        </div>
      </div>

      <div class="px-14 py-14">
        <!--        <h2 class="text-5xl wow animate__zoomIn mb-10">产品功能</h2>-->
        <div
          class="flex justify-evenly lg:flex-col lg:justify-center flex-wrap lg:mb-5"
        >
          <div
            class="mb-5 p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg wow animate__slideInUp"
          >
            <h4 class="text-2xl mb-1 font-bold">智能代码补全</h4>
            <p>
              <CodeOutlined />
              智能分析代码结构，提供准确的代码补全建议。
            </p>
          </div>
          <div
            class="mb-5 p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg wow animate__slideInUp delay-100"
          >
            <h4 class="text-2xl mb-1 font-bold">多语言支持</h4>
            <p>
              <BulbOutlined />
              支持多种常用编程语言，满足不同开发需求。
            </p>
          </div>
        </div>

        <!--        <div class="flex-1 wow animate__slideInUp">-->
        <!--          <img src="@/assets/images/h4.png" class="rounded-2xl" alt="">-->
        <!--        </div>-->
      </div>
    </a-layout-content>
    <a-layout-footer>
      <a-button type="link">隐私政策</a-button>
      <a-button type="link">用户协议</a-button>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped></style>
