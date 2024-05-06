<script lang="ts" name="CopilotPackage" setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import {
  APIGetUsageRecordsParams,
  APIGetUsageRecordsResponseItem,
  getUsageRecords,
} from '@/api/purse.ts';
import { filterLabelItem, filterTable } from '@/interface/common.ts';

const params = reactive<APIGetUsageRecordsParams>({
  status: null,
  page: 1,
  limit: 15,
});
const pageLoading = ref(false);
const tableData = ref<APIGetUsageRecordsResponseItem[]>([]);
const tableFilter = ref<filterTable<APIGetUsageRecordsParams>[]>([]);
const tableTotal = ref<number>(0);

function onChange() {
  pageLoading.value = true;
}

const { run: getTableList } = useRequest(
  async () => {
    return getUsageRecords(toRaw(params)).then((res) => {
      tableData.value = res.list;
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

const labels = ref<{ [key in string]: filterLabelItem[] }>({});

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

    <div class="flex flex-wrap gap-5 mb-5">
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded sm:w-full w-[386px]"
        v-for="item in tableData"
        :key="item.source"
      >
        <div class="">{{ item.source }}</div>

        <a-divider class="my-2" />
        <div class="flex items-center justify-between">
          <span class="text-gray-600">充值时长</span>
          <span>{{ item.recharge_time_label || '0' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">活动状态</span>
          <span>{{ item.status_label || '0' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">使用记录</span>
          <span>{{ item.reason || '无' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">过期时间 </span>
          <span>{{ item.expire_time || '不过期' }}</span>
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
  </div>
</template>
