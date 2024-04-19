import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user.ts';
import { getToken } from '@/utils/auth.ts';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import('@/views/Redirect.vue'),
    },
    {
      path: '/',
      component: () => import('@/layout/homeLayout.vue'),
      children: [
        {
          path: 'home',
          component: () => import('@/views/Home/index.vue'),
        },
        {
          path: 'detail',
          component: () => import('@/views/Detail/index.vue'),
        },
        {
          path: 'order',
          component: () => import('@/views/Order/index.vue'),
        },
        {
          path: 'copilot-package',
          component: () => import('@/views/CopilotPackage/index.vue'),
        },
        {
          path: 'copilot-usage-history',
          component: () => import('@/views/CopilotUsageHistory/index.vue'),
        },
        {
          path: 'purse',
          component: () => import('@/views/Purse/index.vue'),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = getToken();
  const userStore = useUserStore();
  const allRoute = router.getRoutes();
  const hasRoute = allRoute.find((route) => route.path === to.path);

  if (token && !userStore.account_id) {
    await userStore.getUserInfo();
  }

  if (!hasRoute) {
    next('/');
  }

  next();
});

export default router;
