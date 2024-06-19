<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useDarkMode } from 'vue-hooks-plus';
import { useRoute, useRouter } from 'vue-router';
import { MenuOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { BASE_URL, DOCS_URL, FORUM_URL } from '@/config';
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

const open = ref(false);
function clickMenu({ key }: { key: string }) {
  router.push(key);
  open.value = false;
}

const serverTime = computed(() => {
  return getUTCDate(systemStore.timeStamp);
});

const logout = userStore.logout;

function goLogin() {
  window.open(
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
      class="header flex items-center justify-between w-full z-10 fixed transition sm:ps-[1.25rem!important] sm:pe-[1.25rem!important]"
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
        v-if="userInfo.account_id"
        v-model:selectedKeys="current"
        :items="menus"
        class="flex sm:hidden"
        mode="horizontal"
        @click="clickMenu"
      />
      <div class="flex items-center">
        <a-button type="link" :href="FORUM_URL" target="_blank">论坛</a-button>
        <a-button type="link" :href="DOCS_URL" target="_blank">文档</a-button>
        <template v-if="userInfo.account_id">
          <a-dropdown placement="bottom">
            <a class="ant-dropdown-link" @click.prevent>
              {{ userInfo.nick_name || '无名氏' }}
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <span v-else>
          <a-button type="primary" @click="goLogin">登录</a-button>
        </span>
        <a-button
          :type="open ? 'primary' : 'text'"
          class="hidden sm:block"
          v-if="userInfo.account_id"
          @click="open = true"
        >
          <template #icon>
            <MenuOutlined />
          </template>
        </a-button>
      </div>
      <a-drawer v-model:open="open" placement="right">
        <a-menu
          v-model:selectedKeys="current"
          :items="menus"
          mode="inline"
          style="border-inline-end: 0; background: transparent"
          @click="clickMenu"
        />
      </a-drawer>
    </a-layout-header>
    <a-layout-content class="dark:text-white flex-1 content sm:px-5 pt-20">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="flex justify-between">
      <div class="flex sm:flex-col">
        <router-link to="/">
          <a-button type="link">首页</a-button>
        </router-link>
        <!--        <router-link to="/intro">-->
        <!--          <a-button type="link">平台介绍</a-button>-->
        <!--        </router-link>-->
        <!--        <router-link to="/FAQ">-->
        <!--          <a-button type="link" href="/FAQ">常见问题</a-button>-->
        <!--        </router-link>-->
        <router-link to="/refund-agreement">
          <a-button type="link" href="/refund-agreement">退款协议</a-button>
        </router-link>
      </div>
      <div class="flex sm:flex-col">
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
