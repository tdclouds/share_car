<script lang="ts" name="detail" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { getGoodDetail, goodListItem } from '@/api/good.ts';
import {
  APIGetPayTypeItem,
  createOrder,
  createOrderParams,
  getBuyAddress,
  getOrderStatusParams,
  getPayType,
} from '@/api/order.ts';
import { useUserStore } from '@/store/user.ts';
import request from '@/utils/request.ts';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

interface IDetail extends goodListItem {
  gd_description: string;
  ord: number;
  buy_prompt: string;
  pre_api_hook?: string;
  actual_price_label: string;
  wholesale_price_cnf: { buy_num: number; price: number }[];
  other_ipu_cnf: {
    key: string;
    label: string;
    required: boolean;
    status: string;
  }[];
}

const detail = ref<IDetail>({
  actual_price: 0,
  actual_price_label: '',
  buy_limit_num: 0,
  buy_prompt: '',
  created_at: '',
  gd_description: '',
  gd_keywords: [],
  gd_name: '',
  gd_no: '',
  in_stock: 0,
  is_automatic: 0,
  ord: 0,
  other_ipu_cnf: [],
  picture: '',
  retail_price: 0,
  retail_price_label: '',
  sales_volume: 0,
  type: 1,
  wholesale_price_cnf: [],
});

const totalPrice = computed(() => {
  let total = 0;
  for (let i = 0; i < detail.value.wholesale_price_cnf.length; i++) {
    const item = detail.value.wholesale_price_cnf[i];

    if (formData.buy_num >= item.buy_num) {
      total = item.price * formData.buy_num;
      break;
    } else {
      total = detail.value.retail_price * formData.buy_num;
    }
  }
  return computeTotalPrice(total);
});

function computeTotalPrice(total: number) {
  let res = '';
  const g = Math.floor(total / 10000);
  const s = Math.floor((total % 10000) / 100);
  const c = total % 100;
  if (g) {
    res += g + ' 金币';
  }
  if (s) {
    res += s + ' 银币';
  }
  if (c) {
    res += c + ' 铜币';
  }
  return res;
}

function getDetail() {
  getGoodDetail(formData.gd_no as string)
    .then((res) => {
      detail.value = {
        ...res,
        wholesale_price_cnf: res.wholesale_price_cnf
          .map((item) => {
            const arr = item.split('=');
            return {
              buy_num: +arr[0],
              price: +arr[1],
            };
          })
          .sort((a, b) => b.buy_num - a.buy_num),
        other_ipu_cnf: res.other_ipu_cnf.map((item) => {
          const arr = item.split('=');
          return {
            key: arr[0],
            label: arr[1],
            required: arr[2] === 'true',
            status: '',
          };
        }),
      };
    })
    .catch(() => {
      formData.gd_no = '';
    });
}

// 获取购买状态
function getPurchaseStatus(url?: string) {
  if (!url) {
    return;
  } else if (url.startsWith('http')) {
    open(url, '_blank');
  } else {
    request({
      url,
      hideError: true,
    })
      .then(() => {
        submitDisabled.value = false;
      })
      .catch((res) => {
        submitDisabled.value = true;
        Modal.alert({
          content: res.data.message,
        });
      });
  }
}

const formData = reactive<createOrderParams>({
  buy_num: 1,
  gd_no: '',
  other_ipu: {},
});
const orderParams = reactive<getOrderStatusParams>({
  orderNo: '',
  payCheck: '',
});

watch(formData, validatorForm);

function validatorForm() {
  detail.value.other_ipu_cnf.forEach((item) => {
    if (item.required && !formData.other_ipu[item.key]) {
      item.status = 'error';
    } else {
      item.status = '';
    }
  });
}

function handleSubmit() {
  validatorForm();
  if (detail.value.other_ipu_cnf.some((item) => item.status)) {
    message.error({
      content: '请填写完整信息',
    });
    return;
  }
  if (!userStore.account_id) {
    Modal.info({
      title: '请登录',
      content: '请先登录后再购买',
    });
    return;
  }

  if (detail.value.pre_api_hook) {
    getPurchaseStatus(detail.value.pre_api_hook);
  }
  visibleBuyModal.value = true;
}

const visibleBuyModal = ref(false);
const BuySubmitLoading = ref(false);

function handleBuy() {
  BuySubmitLoading.value = true;
  createOrder(formData)
    .then((res) => {
      orderParams.orderNo = res.order_no;
      getPayAddress();
      visibleBuyModal.value = false;
    })
    .finally(() => {
      BuySubmitLoading.value = false;
    });
}

const submitDisabled = ref(false);

function getPayAddress() {
  getBuyAddress(orderParams).catch((res) => {
    if (res.status !== 303) {
      return;
    }
    if (!res.data?.data?.hook_url) {
      return;
    }
    request({
      url: res.data.data.hook_url,
      method: 'post',
    }).then(() => {
      message.success('支付成功');
      router.push('/order');
    });
  });
}

const payTypeList = ref<APIGetPayTypeItem[]>([]);

function getPayTypeList() {
  getPayType()
    .then((res) => {
      payTypeList.value = res;
      orderParams.payCheck = res[0].pay_check;
    })
    .catch(() => {});
}

onMounted(() => {
  formData.gd_no = (route.query.id as string) || '';
  if (formData.gd_no) {
    getDetail();
    userStore.account_id && getPayTypeList();
  }
});
</script>

<template>
  <div v-if="formData.gd_no" class="detail w-[1100px] mx-auto my-0 flex">
    <div class="w-[600px] mr-4">
      <div class="flex bg-white dark:bg-gray-700 p-4 rounded mb-4">
        <img :src="detail.picture" alt="" class="w-28 h-28 rounded" />
        <div class="flex-1 px-4">
          <p class="text-4xl text-gray-800 dark:text-gray-100">
            <span>{{ detail.gd_name }}</span>
          </p>
          <div class="flex justify-between items-end">
            <p>
              <span class="mr-4">已售：{{ detail.sales_volume }}</span>
              <span class="mr-4">库存：{{ detail.in_stock }}</span>
            </p>
            <span class="text-red-500 text-2xl"
              >单价：{{ detail.retail_price_label }}</span
            >
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-700 p-4 rounded mb-4">
        <span
          v-for="tag in detail.gd_keywords"
          :key="formData.gd_no + tag"
          class="py-2 px-4 mr-2 rounded bg-gray-200 text-gray-700 dark:bg-gray-500 dark:text-gray-200"
          >{{ tag }}</span
        >
      </div>
      <div class="bg-white dark:bg-gray-700 p-4 rounded mb-4">
        <p class="text-xl mb-2">商品详情：</p>
        <p
          class="text-gray-500 dark:text-gray-200 py-2"
          v-html="detail.gd_description"
        ></p>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded mb-4 w-[480px]">
      <div class="flex justify-between items-center mb-2">
        <p class="text-xl">购买数量：</p>
        <div class="flex">
          <a-input-number
            v-model:value="formData.buy_num"
            :controls="false"
            :max="detail.in_stock"
            :min="1"
            :precision="0"
            class="w-[190px]"
          />
        </div>
      </div>
      <div class="mb-2 text-gray-500">
        <p v-for="item in detail.wholesale_price_cnf" :key="item.buy_num">
          购买<span
            class="px-2 py-1 border-dashed border-gray-400 rounded text-red-500"
            >{{ item.buy_num }}</span
          >个按照<span
            class="px-2 py-1 border-dashed border-gray-400 rounded text-red-500"
            >{{ computeTotalPrice(item.price) }}</span
          >售卖
        </p>
      </div>
      <div class="flex justify-between items-center mb-2">
        <p class="text-xl">支付方式：</p>
        <div class="flex">
          <a-radio-group
            v-model:value="orderParams.payCheck"
            button-style="solid"
          >
            <a-radio-button
              v-for="item in payTypeList"
              :key="item.pay_check"
              :value="item.pay_check"
              >{{ item.pay_name }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div v-for="item in detail.other_ipu_cnf" :key="item.key" class="mb-2">
        <div class="flex justify-between items-center">
          <p class="text-xl">{{ item.label }}：</p>
          <div class="flex">
            <a-input
              v-model:value="formData.other_ipu[item.key]"
              :placeholder="'请输入' + item.label"
              :status="item.status"
              class="w-[190px]"
            />
          </div>
        </div>
        <p v-if="item.status" class="text-right text-red-500">
          {{ '请输入' + item.label }}
        </p>
      </div>
      <div class="flex justify-between items-center mb-2">
        <p class="text-xl">总价：</p>
        <div class="flex text-red-500 text-2xl">{{ totalPrice }}</div>
      </div>
      <div>
        <a-button
          :disabled="submitDisabled"
          class="w-full"
          type="primary"
          @click="handleSubmit"
          >{{ submitDisabled ? '你不配' : '立即购买' }}
        </a-button>
      </div>
    </div>
  </div>
  <a-result
    v-else
    class="bg-white dark:bg-gray-700 w-[1200px] m-auto rounded-2xl"
    status="404"
    sub-title="抱歉, 您访问的商品不存在。"
    title="没找到商品"
  >
    <template #extra>
      <a-button type="primary">首页</a-button>
    </template>
  </a-result>
  <a-modal
    v-model:open="visibleBuyModal"
    :maskClosable="false"
    destroyOnClose
    title="购买提示"
  >
    <template #footer>
      <a-button @click="visibleBuyModal = false">再考虑一下</a-button>
      <a-button :loading="BuySubmitLoading" type="primary" @click="handleBuy"
        >已知晓，继续购买
      </a-button>
    </template>
    <div v-html="detail.buy_prompt"></div>
  </a-modal>
</template>

<style scoped></style>
