import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user.ts';
import { getToken } from '@/utils/auth.ts';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import('@/views/Redirect.vue'),
    },
    {
      path: '/',
      redirect: '/home',
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
          path: 'intro',
          component: () => import('@/views/Intro/index.vue'),
        },
        {
          path: 'FAQ',
          component: () => import('@/views/FAQ/index.vue'),
        },
        {
          path: 'refund-agreement',
          component: () => import('@/views/RefundAgreement/index.vue'),
        },
        {
          path: '403',
          component: () => import('@/views/errors/403/index.vue'),
        },
        {
          path: '404',
          component: () => import('@/views/errors/404/index.vue'),
        },
        {
          path: 'order',
          meta: {
            needLogin: true,
          },
          component: () => import('@/views/Order/index.vue'),
        },
        {
          path: 'copilot-package',
          meta: {
            needLogin: true,
          },
          component: () => import('@/views/CopilotPackage/index.vue'),
        },
        {
          path: 'copilot-usage-history',
          meta: {
            needLogin: true,
          },
          component: () => import('@/views/CopilotUsageHistory/index.vue'),
        },
        {
          path: 'purse',
          meta: {
            needLogin: true,
          },
          component: () => import('@/views/Purse/index.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const token = getToken();
  const userStore = useUserStore();
  const allRoute = router.getRoutes();
  const hasRoute = allRoute.find((route) => route.path === to.path);

  if (token && !userStore.account_id) {
    await userStore.getUserInfo();
  }

  if (to.meta.needLogin && !token) {
    next('/403');
  } else if (!hasRoute) {
    next('/404');
  } else {
    next();
  }
});

export default router;
