<script lang="ts" name="ListProducts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import { getGoodList, goodListItem, goodListParams } from '@/api/good.ts';
import { filterTable } from '@/interface/common.ts';
import { formatPrice } from '@/utils/format.ts';

const params = reactive<goodListParams>({
  limit: 10,
  page: 1,
  search_value: '',
});
const tableData = ref<goodListItem[]>([]);
const tableDataTotal = ref(0);
const tableFilter = ref<filterTable<goodListParams>[]>([]);

const { run: getTableList } = useRequest(
  async () => {
    return getGoodList(toRaw(params)).then((res) => {
      tableData.value = res.list;
      tableDataTotal.value = res.total;
      tableFilter.value = res.filter;
    });
  },
  {
    debounceWait: 500,
    manual: true,
  },
);

function searchHandle() {
  params.page = 1;
  getTableList();
}

onMounted(() => {
  getTableList();
});
</script>

<template>
  <div class="flex w-full max-w-[1200px]">
    <div class="ml-auto sm:w-full">
      <a-input-search
        v-model:value="params.search_value"
        @search="searchHandle"
        class="sm:flex-1 min-w-[320px]"
        size="large"
        prefixCls="flex items-center ant-input-search"
        placeholder="搜索"
        enter-button
      />
    </div>
  </div>
  <div class="list flex flex-wrap w-[1200px] max-w-full gap-5 mb-5">
    <router-link
      v-for="item in tableData"
      :key="item.gd_no"
      :to="'/detail?id=' + item.gd_no"
      class="translate-x-1 bg-white image-card flex relative pointer w-[590px] max-w-full rounded-xl border transition dark:border-gray-700 overflow-hidden dark:bg-gray-800 dark:shadow-gray-700 hover:text-blue-400 hover:shadow-xl"
    >
      <img
        :alt="item.gd_name"
        :src="item.picture"
        class="w-[138px] h-full object-contain"
        loading="lazy"
      />
      <div class="p-2 flex-1">
        <h4 class="text-2xl">{{ item.gd_name }}</h4>
        <div class="overflow-hidden flex flex-wrap gap-1 my-2">
          <div
            v-for="tag in item.gd_keywords"
            :key="item.gd_no + tag"
            class="py-1 px-2 rounded bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-200"
          >
            {{ tag }}
          </div>
          <div
            v-if="item.is_automatic"
            class="py-1 px-2 mr-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-200"
          >
            自动发货
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="flex sm:flex-col">
            <span class="mr-4 text-gray-900 dark:text-gray-300"
              >库存：{{ item.in_stock }}</span
            >
            <span class="text-red-500">已售：{{ item.sales_volume }}</span>
          </p>
          <p class="image-price">
            <span class="text-xl text-blue-600 dark:text-blue-400">{{
              formatPrice(item.retail_price)
            }}</span>
          </p>
        </div>
      </div>
    </router-link>
  </div>
  <a-pagination
    v-model:current="params.page"
    v-model:size="params.limit"
    :total="tableDataTotal"
    hide-on-single-page
    show-less-items
    @change="getTableList"
  />
</template>

<style scoped>
.image-card {
  animation-fill-mode: backwards;
}
</style>
