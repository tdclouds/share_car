<script lang="ts" name="Order" setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import { TablePaginationConfig } from 'ant-design-vue';
import {
  APIOrderParams,
  APIOrderResponseItem,
  getOrderList,
} from '@/api/order.ts';
import { filterLabelItem, filterTable } from '@/interface/common.ts';
import OrderDetailModal from './components/OrderDetailModal.vue';

const tableColumns = [
  { title: '订单编号', dataIndex: 'order_no' },
  { title: '订单类型', dataIndex: 'type_label' },
  { title: '商品标题', dataIndex: 'title' },
  { title: '购买数量', dataIndex: 'buy_num' },
  { title: '订单状态', dataIndex: 'status_label' },
  { title: '订单金额', dataIndex: 'price_label' },
  { title: '订单支付金额', dataIndex: 'pay_price_label' },
  { title: '付款渠道', dataIndex: 'payment_channel' },
  { title: '第三方事务号', dataIndex: 'trade_no' },
  { title: '操作', dataIndex: 'operation', fixed: 'right' },
];
const params = reactive<APIOrderParams>({
  end_time: '',
  gd_no: '',
  order_no: '',
  start_time: '',
  page: 1,
  limit: 10,
});
const loading = ref(false);
const pageLoading = ref(false);
const tableData = ref<APIOrderResponseItem[]>([]);
const tableFilter = ref<filterTable<APIOrderParams>[]>([]);
const tablePagination = reactive<TablePaginationConfig>({
  current: params.page,
  pageSize: params.limit,
  hideOnSinglePage: true,
  pageSizeOptions: ['10', '15', '20'],
  showTotal(total) {
    return `共 ${total} 条`;
  },
  showSizeChanger: true,
  onChange(page, pageSize) {
    pageLoading.value = true;
    params.page = page;
    params.limit = pageSize;
    tablePagination.current = page;
    tablePagination.pageSize = pageSize;
  },
  total: 0,
});

const { run: getTableList } = useRequest(
  async () => {
    return getOrderList(toRaw(params)).then((res) => {
      tableData.value = res.list;
      tablePagination.total = res.total;
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
    tablePagination.current = 1;
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
  <div class="w-[1200px] m-auto">
    <div class="flex items-start justify-between mb-4">
      <a-form class="filter" layout="inline">
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

    <a-table
      :columns="tableColumns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="tablePagination"
      :row-key="(record: APIOrderResponseItem) => record.gd_no"
      bordered
      class="w-full mb-4"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button class="mr-1" type="primary" @click="showDetail(record)"
            >详情
          </a-button>
        </template>
      </template>
    </a-table>

    <OrderDetailModal
      v-if="visibleDetailModal"
      v-model:visible="visibleDetailModal"
      :currentId="currentId"
    />
  </div>
</template>
