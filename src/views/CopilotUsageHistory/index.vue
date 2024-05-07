<script lang="ts" name="CopilotUsageHistory" setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  APIGetCopilotSessionParams,
  APIGetCopilotSessionResponseItem,
  getCopilotSession,
} from '@/api/purse.ts';
import { filterLabelItem, filterTable } from '@/interface/common.ts';

const params = reactive<APIGetCopilotSessionParams>({
  page: 1,
  limit: 15,
});
const pageLoading = ref(false);
const tableData = ref<APIGetCopilotSessionResponseItem[]>([]);
const tableFilter = ref<filterTable<APIGetCopilotSessionParams>[]>([]);
const tableTotal = ref<number>(0);

function onChange() {
  pageLoading.value = true;
}

const { run: getTableList } = useRequest(
  async () => {
    return getCopilotSession(toRaw(params)).then((res) => {
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
        :key="item.session_no"
      >
        <div class="text-center">{{ item.start_time }}-{{ item.end_time }}</div>

        <a-divider class="my-2" />
        <div class="flex items-center justify-between">
          <span>使用时间</span>
          <span>{{ item.total_time_label || '0' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span
            >请求次数
            <a-tooltip placement="top">
              <template #title>
                <span>实际采集请求次数，失败请求同样计算在内</span>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>
          </span>
          <span>{{ item.total_req_label || '0' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span>对话次数</span>
          <span>{{ item.total_chat_req_label || '0' }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span>代码提示次数</span>
          <span>{{ item.total_prompt_req_label || '0' }}</span>
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
