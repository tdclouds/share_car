<script lang="ts" name="Order" setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import {
  APIOrderParams,
  APIOrderResponseItem,
  getOrderList,
} from '@/api/order.ts';
import { filterLabelItem, filterTable } from '@/interface/common.ts';
import OrderDetailModal from './components/OrderDetailModal.vue';

const params = reactive<APIOrderParams>({
  end_time: '',
  gd_no: '',
  order_no: '',
  start_time: '',
  page: 1,
  limit: 15,
});
const pageLoading = ref(false);
const tableData = ref<APIOrderResponseItem[]>([]);
const tableTotal = ref<number>(0);
const tableFilter = ref<filterTable<APIOrderParams>[]>([]);

function onChange() {
  pageLoading.value = true;
}

const { run: getTableList } = useRequest(
  async () => {
    return getOrderList(toRaw(params)).then((res) => {
      tableData.value = res.list;
      tableTotal.value = res.total;
      tableFilter.value = res.filter;
      formatLabels();
      pageLoading.value = false;
    });
  },
  {
    debounceWait: 1000,
    manual: true,
  },
);

function formatLabels() {
  tableFilter.value.forEach((item) => {
    if (item.options) {
      labels.value[item.name] = (item.options as filterLabelItem[]).filter(
        (item) => item.value !== 0,
      );
    }
  });
}

watch(params, () => {
  if (pageLoading.value === false) {
    params.page = 1;
  }
  getTableList();
});

const currentId = ref('');
const labels = ref<{ [key in string]: filterLabelItem[] }>({});
const visibleDetailModal = ref(false);

function showDetail(row?: APIOrderResponseItem) {
  currentId.value = row?.order_no || '';

  visibleDetailModal.value = true;
}

onMounted(getTableList);
</script>

<template>
  <div class="w-[1200px] max-w-full m-auto">
    <div class="flex items-start justify-between mb-4">
      <a-form class="filter sm:hidden" layout="inline">
        <a-form-item
          v-for="item in tableFilter"
          :key="item.name"
          :label="item.label"
        >
          <component
            :is="'a-date-picker'"
            v-if="item.type === 'datetime'"
            v-model:value="params[item.name]"
            :placeholder="item.label"
            :show-time="{ format: 'HH:mm' }"
            allow-clear
            class="w-[180px!important] mr-2 mb-2"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />

          <component
            :is="'a-' + item.type"
            v-else
            v-model:value="params[item.name]"
            :options="item.options"
            :placeholder="item.label"
            allow-clear
            class="w-[180px!important] mr-2 mb-2"
          />
        </a-form-item>
      </a-form>
    </div>

    <div class="list-box flex flex-wrap gap-5 mb-5">
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded sm:w-full"
        v-for="item in tableData"
        :key="item.order_no"
      >
        <div class="flex items-center justify-between">
          <span>{{ item.order_no }}</span>
          <span class="text-blue-600 ml-2" @click="showDetail(item)"
            >详情
          </span>
        </div>
        <a-divider class="my-2" />
        <div class="flex items-center justify-between">
          <div>{{ item.title }}</div>
          <div
            :class="
              {
                100: 'text-gray-600',
                200: 'text-orange-500',
                201: 'text-blue-600',
                202: 'text-green-600',
                300: 'text-gray-500',
                400: 'text-red-500',
                403: 'text-gray-500',
              }[item.status]
            "
          >
            {{ item.status_label }}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="label text-gray-600 mt-2">订单金额</div>
          <div class="content text-gray-600">{{ item.price_label }}</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="label text-gray-600 mt-2">订单支付金额</div>
          <div class="content">{{ item.pay_price_label }}</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="label text-gray-600 mt-2">付款渠道</div>
          <div class="content">{{ item.payment_channel }}</div>
        </div>
      </div>
    </div>

    <a-pagination
      class="flex justify-center"
      v-model:current="params.page"
      v-model:page-size="params.limit"
      :total="tableTotal"
      :hide-on-single-page="true"
      @change="onChange"
      :show-total="(total: number) => `共 ${total} 条`"
    />

    <OrderDetailModal
      v-if="visibleDetailModal"
      v-model:visible="visibleDetailModal"
      :currentId="currentId"
    />
  </div>
</template>
