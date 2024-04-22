<script lang="ts" name="purse" setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import { TablePaginationConfig } from 'ant-design-vue';
import {
  APIGetCoinParams,
  APIGetCoinResponseItem,
  APIGetCoinsResponseItem,
  getCoin,
  getCoins,
} from '@/api/purse.ts';
import { filterLabelItem, filterTable } from '@/interface/common.ts';

const tableColumns = [
  { title: '数量', dataIndex: 'num' },
  { title: '余额', dataIndex: 'balance' },
  { title: '备注信息', dataIndex: 'content' },
  { title: '过期时间', dataIndex: 'expire_time' },
  { title: '使用状态', dataIndex: 'is_use_label' },
  { title: '创建时间', dataIndex: 'created_at' },
];
const coinType = ref(0);
const params = reactive<APIGetCoinParams>({
  page: 1,
  limit: 10,
});
const loading = ref(false);
const pageLoading = ref(false);
const tableData = ref<APIGetCoinResponseItem[]>([]);
const tableFilter = ref<filterTable<APIGetCoinParams>[]>([]);
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
    return getCoin(coinType.value, toRaw(params)).then((res) => {
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

const coinList = ref<APIGetCoinsResponseItem[]>([]);

async function getCoinList() {
  await getCoins().then((res) => {
    coinList.value = res;
    coinType.value = res[0].type;
  });
}

watch(params, () => {
  if (pageLoading.value === false) {
    params.page = 1;
    tablePagination.current = 1;
  }
  getTableList();
});

const labels = ref<{ [key in string]: filterLabelItem[] }>({});

onMounted(async () => {
  await getCoinList();
  getTableList();
});
</script>

<template>
  <div class="w-[1200px] m-auto">
    <div class="flex items-start justify-between mb-4">
      <a-form class="filter" layout="inline">
        <a-form-item label="钱包">
          <a-select
            v-model:value="coinType"
            :field-names="{ label: 'type_label', value: 'type' }"
            :options="coinList"
            class="w-[180px!important] mr-2 mb-2"
          />
        </a-form-item>
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
      :row-key="(record: APIGetCoinResponseItem) => record.id"
      bordered
      class="w-full mb-4"
    />
  </div>
</template>
