<script lang="ts" name="ListProducts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import { getGoodList, goodListItem, goodListParams } from '@/api/good.ts';

const params = reactive<goodListParams>({
  limit: '20',
  page: 1,
  search_value: '',
});
const tableData = ref<goodListItem[]>([]);
const tableDataTotal = ref(0);
const { run: getTableList } = useRequest(
  async () => {
    return getGoodList(toRaw(params)).then((res) => {
      tableData.value = res.list;
      tableDataTotal.value = res.total;
    });
  },
  {
    debounceWait: 500,
    manual: true,
  },
);

onMounted(() => {
  getTableList();
});
</script>

<template>
  <div class="list flex flex-wrap w-[1200px] pt-5">
    <router-link
      v-for="item in tableData"
      :key="item.gd_no"
      :to="'/detail?id=' + item.gd_no"
      class="image-card flex pointer w-full rounded-xl border dark:border-slate-500 overflow-hidden bg-gray-100 dark:bg-gray-800 dark:shadow-gray-700 hover:text-blue-400 hover:shadow-xl mb-6"
    >
      <img
        :alt="item.gd_name"
        :src="item.picture"
        class="w-32 h-32"
        loading="lazy"
      />
      <div class="p-2 flex-1">
        <h4 class="text-2xl">{{ item.gd_name }}</h4>
        <p class="overflow-hidden my-4">
          <span
            v-for="tag in item.gd_keywords"
            :key="item.gd_no + tag"
            class="py-1 px-2 mr-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-200"
            >{{ tag }}</span
          >
          <span
            v-if="item.is_automatic"
            class="py-1 px-2 mr-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-200"
            >自动发货</span
          >
        </p>
        <div class="flex justify-between items-center">
          <p class="">
            <span class="mr-4">库存：{{ item.in_stock }}</span>
            <span class="text-red-500">已售：{{ item.sales_volume }}</span>
          </p>
          <p class="image-price">
            <span class="text-xl text-blue-600 dark:text-blue-400">{{
              item.actual_price_label
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

<style scoped></style>
