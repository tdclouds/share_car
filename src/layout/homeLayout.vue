<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useDarkMode } from 'vue-hooks-plus';
import { useRoute, useRouter } from 'vue-router';
import { MenuProps } from 'ant-design-vue';
import { BASE_URL } from '@/config';
import { useSystemStore } from '@/store/system.ts';
import { useUserStore } from '@/store/user.ts';
import { getUTCDate } from '@/utils/format.ts';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const systemStore = useSystemStore();

const [darkMode] = useDarkMode();
const headerStyle = reactive({
  backgroundColor: 'transparent',
});

const userInfo = computed(() => {
  return userStore.userInfo;
});

const current = ref([window.location.pathname]);
const menus = ref<MenuProps['items']>([
  {
    key: '/home',
    label: '首页',
  },
  {
    key: '/order',
    label: '我的订单',
  },
  {
    key: '/copilot',
    label: 'Copilot',
    children: [
      {
        key: '/copilot-package',
        label: '套餐列表',
      },
      {
        key: '/copilot-usage-history',
        label: '使用记录',
      },
    ],
  },
  {
    key: '/purse',
    label: '钱包明细',
  },
]);

watch(route, (value) => {
  current.value = [value.path];
});

function clickMenu({ key }: { key: string }) {
  router.push(key);
}

const serverTime = computed(() => {
  return getUTCDate(systemStore.timeStamp);
});

const logout = userStore.logout;

function goLogin() {
  open(
    `${BASE_URL}/oauth/discourse/redirect?callback_url=${location.origin}/redirect`,
    '_self',
  );
}
</script>

<template>
  <a-layout class="bg-transparent flex flex-col">
    <a-layout-header
      :class="{ dark: darkMode }"
      :style="headerStyle"
      class="header flex items-center justify-between w-full z-10 fixed transition"
    >
      <router-link to="/">
        <img
          alt="logo"
          class="rounded-full w-12 h-12"
          loading="lazy"
          src="@/assets/images/logo.jpg"
        />
      </router-link>

      <a-menu
        v-if="userStore.account_id"
        v-model:selectedKeys="current"
        :items="menus"
        mode="horizontal"
        @click="clickMenu"
      />

      <template v-if="userStore.account_id">
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            {{ userInfo.nick_name }}
          </a>
          <template #overlay>
            <a-menu>
              <router-link to="/order">
                <a-menu-item>我的订单</a-menu-item>
              </router-link>
              <a-menu-item @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <span v-else>
        <a-button @click="goLogin">登录</a-button>
      </span>
    </a-layout-header>
    <a-layout-content class="dark:text-white pt-20 flex-1 content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="flex justify-between">
      <div>
        <a-button type="link">用户协议</a-button>
        <a-button type="link">隐私政策</a-button>
      </div>
      <div>
        <span>服务器时间：</span>
        <span class="text-blue-500">{{ serverTime }}</span>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.header {
  backdrop-filter: saturate(50%) blur(4px);
}

.header .ant-menu {
  background-color: transparent;
  border-bottom: none;
}

.content {
  min-height: calc(100vh - 80px);
}
</style>
