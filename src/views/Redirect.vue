<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { getDiscourseSSO } from '@/api/user.ts';
import { setToken } from '@/utils/auth.ts';

const router = useRouter();
const route = useRoute();

function handleGithubAuthorized() {
  const { t, s, sso, sig } = route.query;

  if (
    typeof t !== 'string' ||
    typeof s !== 'string' ||
    typeof sso !== 'string' ||
    typeof sig !== 'string'
  ) {
    showErrorModal('参数错误');
    return;
  }

  getDiscourseSSO({ t, s, sso, sig })
    .then((res) => {
      router.replace('home');
      setToken(res.token, res.expire_at);
    })
    .catch((err) => {
      showErrorModal(err.data.message);
    });
}

function showErrorModal(content: string) {
  Modal.error({
    title: '提示',
    content: content,
    onOk() {
      router.replace('home');
    },
  });
}

onMounted(handleGithubAuthorized);
</script>

<template>
  <div class="flex items-center justify-center h-[100vh]">
    <div class="loader"></div>
  </div>
</template>

<style>
.loader {
  width: 40px;
  height: 20px;
  --c: no-repeat
    radial-gradient(farthest-side, var(--primary-color, #000) 93%, #0000);
  background:
    var(--c) 0 0,
    var(--c) 50% 0;
  background-size: 8px 8px;
  position: relative;
  clip-path: inset(-200% -100% 0 0);
  animation: l6-0 1.5s linear infinite;
}

.loader:before {
  content: '';
  position: absolute;
  width: 8px;
  height: 12px;
  background: var(--primary-color, #000);
  left: -16px;
  top: 0;
  animation:
    l6-1 1.5s linear infinite,
    l6-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
}

.loader:after {
  content: '';
  position: absolute;
  inset: 0 0 auto auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color, #000);
  animation: l6-3 1.5s linear infinite;
}

@keyframes l6-0 {
  0%,
  30% {
    background-position:
      0 0,
      50% 0;
  }
  33% {
    background-position:
      0 100%,
      50% 0;
  }
  41%,
  63% {
    background-position:
      0 0,
      50% 0;
  }
  66% {
    background-position:
      0 0,
      50% 100%;
  }
  74%,
  100% {
    background-position:
      0 0,
      50% 0;
  }
}

@keyframes l6-1 {
  90% {
    transform: translateY(0);
  }
  95% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(15px);
    left: calc(100% - 8px);
  }
}

@keyframes l6-2 {
  100% {
    top: -0.1px;
  }
}

@keyframes l6-3 {
  0%,
  80%,
  100% {
    transform: translate(0);
  }
  90% {
    transform: translate(26px);
  }
}
</style>
