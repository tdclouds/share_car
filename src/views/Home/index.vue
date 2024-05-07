<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  APIGetCoinsResponseItem,
  APIGetCopilotServiceResponse,
  APIGetUsageRecordsResponseItem,
  changeCopilotService,
  getCoins,
  getCopilotService,
  getUsageRecords,
  queryRedemptionCode,
  useRedemptionCode,
} from '@/api/purse.ts';
import { useSystemStore } from '@/store/system.ts';
import { useUserStore } from '@/store/user.ts';
import { duration, getUTCDate } from '@/utils/format.ts';
import ListProducts from '@/views/Home/components/ListProducts.vue';

const serverRef = ref();
const size = ref({ width: 0, height: 0 });
const userStore = useUserStore();
const systemStore = useSystemStore();

const copilotInfo = ref<APIGetCopilotServiceResponse>({
  paused_time: undefined,
  remaining_time: 0,
  start_time: undefined,
  is_paused: 1,
});

const remaining_time = computed(() => {
  return duration(copilotInfo.value.remaining_time, 'second');
});

function startTimer() {
  if (copilotInfo.value.is_paused == 1) return;

  setTimeout(() => {
    copilotInfo.value.remaining_time -= 1;
    startTimer();
  }, 1000);
}

function getCopilotInfo() {
  getCopilotService().then((res) => {
    copilotInfo.value = res;
    startTimer();
  });
}

const changeCopilotStatusLoading = ref(false);

function updateCopilotStatus() {
  changeCopilotStatusLoading.value = true;
  changeCopilotService()
    .then((res) => {
      copilotInfo.value.remaining_time = res.remaining_time;
      copilotInfo.value.is_paused = res.is_paused;
      startTimer();
    })
    .finally(() => {
      changeCopilotStatusLoading.value = false;
    });
}

const coinList = ref<APIGetCoinsResponseItem[]>([]);

function getCoinList() {
  getCoins()
    .then((res) => {
      coinList.value = res;
    })
    .finally(() => {
      onResize();
    });
}

const redemptionCode = ref('');
const useRedemptionCodeLoading = ref(false);

// 使用兑换码
function useExchangeCode() {
  if (!redemptionCode.value) {
    Modal.warn({
      title: '请输入兑换码',
    });
    return;
  }
  useRedemptionCodeLoading.value = true;
  useRedemptionCode(redemptionCode.value)
    .then(() => {
      redemptionCode.value = '';
      getCoinList();
      message.success('兑换成功');
    })
    .finally(() => {
      useRedemptionCodeLoading.value = false;
    });
}

const queryRedemptionCodeLoading = ref(false);

// 使用兑换码
function queryExchangeCode() {
  if (!redemptionCode.value) {
    Modal.warn({
      title: '请输入兑换码',
    });
    return;
  }
  queryRedemptionCodeLoading.value = true;
  queryRedemptionCode(redemptionCode.value)
    .then(() => {
      redemptionCode.value = '';
      Modal.success({
        title: '兑换码有效',
      });
    })
    .finally(() => {
      queryRedemptionCodeLoading.value = false;
    });
}

const copilotSessionList = ref<APIGetUsageRecordsResponseItem[]>([]);

function getCopilotRecharge() {
  getUsageRecords({ status: 'ACTIVE', order_by: 'asc' }).then((res) => {
    copilotSessionList.value = res.list.map(computedPercent);
  });
}

function computedPercent(item: APIGetUsageRecordsResponseItem) {
  item.reason_label = item.reason || '已使用：0s';
  const res = item.reason_label.match(/\d+/) as RegExpMatchArray;
  item.reason = res[0];
  item.percent = 100 - (+item.reason / item.recharge_time) * 100;

  return item;
}

const serverTime = computed(() => {
  return getUTCDate(systemStore.timeStamp);
});

function onResize() {
  const computedStyle = getComputedStyle(serverRef.value);
  size.value = {
    width: parseFloat(computedStyle.width),
    height: parseFloat(computedStyle.height),
  };
}

onMounted(() => {
  if (userStore.account_id) {
    getCopilotInfo();
    getCoinList();
    getCopilotRecharge();
  }
});
</script>
<template name="Home">
  <div class="home flex flex-col items-center gap-5">
    <div
      v-if="userStore.account_id"
      class="flex flex-wrap w-[1200px] max-w-full sm:flex-col-reverse gap-5"
    >
      <!--      <div class="bg-white w-[300px] border rounded-xl flex-shrink-0">公告</div>-->

      <div
        :style="{
          height: size.height + 'px',
        }"
        class="flex-1 sm:min-w-[300px] flex flex-col bg-white dark:bg-gray-800 dark:border-gray-900 border rounded-xl overflow-hidden"
      >
        <div class="p-5 flex justify-between items-center">
          <h4>套餐</h4>
          <router-link to="/copilot-package"
            ><span class="text-blue-500 cursor-pointer">更多</span></router-link
          >
        </div>
        <a-divider class="m-0" />
        <div
          class="h-full overflow-auto scrollbar-width-none flex-1"
          v-if="copilotSessionList.length"
        >
          <template
            v-for="(item, index) in copilotSessionList"
            :key="item.source"
          >
            <a-divider class="m-0" v-if="index != 0" />
            <div class="hover:bg-gray-100 dark:hover:bg-gray-900 p-5">
              <div class="flex items-center justify-between">
                <h4>{{ item.source }}</h4>
                <span>总时长：{{ item.recharge_time_label }}</span>
              </div>
              <a-progress
                :percent="item.percent"
                :show-info="false"
                class="mb-0"
                strokeColor="#1677ff"
              />
              <div class="flex items-center justify-between">
                <span
                  >剩余：{{
                    duration(
                      item.recharge_time - +(item.reason || '0'),
                      'second',
                    )
                  }}</span
                >
                <span
                  >已使用：{{ duration(+(item.reason || '0'), 'second') }}</span
                >
              </div>
            </div>
          </template>
        </div>

        <div v-else>
          <div class="h-full flex items-center justify-center">
            <a-empty />
          </div>
        </div>
      </div>

      <div
        ref="serverRef"
        class="w-[300px] sm:w-full flex flex-col gap-5 flex-shrink-0"
      >
        <div class="copilot-box rounded-xl p-5">
          <ul>
            <li class="flex justify-between mb-2">
              <span class="font-bold text-gray-50">Copilot</span>
              <a-switch
                :checked="copilotInfo.is_paused"
                :checked-value="0"
                :loading="changeCopilotStatusLoading"
                :un-checked-value="1"
                checked-children="开"
                class="copilot-green"
                un-checked-children="关"
                @click="updateCopilotStatus"
              />
            </li>
            <li class="flex justify-between items-center text-gray-200">
              <span class="">剩余时间</span>
              <span class="text-2xl">{{ remaining_time }}</span>
            </li>
          </ul>
        </div>
        <div
          class="bg-white dark:bg-gray-800 dark:border-gray-900 border rounded-xl p-5"
        >
          <div class="flex justify-between items-center mb-2">
            <h4 class="">我的钱包</h4>
            <router-link to="/purse"
              ><span class="text-blue-500 cursor-pointer"
                >更多</span
              ></router-link
            >
          </div>
          <ul class="flex flex-col gap-2">
            <li
              v-for="item in coinList"
              :key="item.type_label"
              class="flex justify-between"
            >
              <span class="text-gray-600 dark:text-gray-200">{{
                item.type_label
              }}</span>
              <span>{{ item.balance_label || '0' }}</span>
            </li>
            <li class="flex flex-col justify-between gap-2">
              <a-input
                v-model:value.trim="redemptionCode"
                allow-clear
                placeholder="兑换码"
              />
              <div class="flex gap-2">
                <a-button
                  :loading="queryRedemptionCodeLoading"
                  class="flex-1"
                  @click="queryExchangeCode"
                  >查询
                </a-button>
                <a-button
                  :loading="useRedemptionCodeLoading"
                  type="primary"
                  class="flex-1"
                  @click="useExchangeCode"
                  >充值
                </a-button>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="bg-white dark:bg-gray-800 dark:border-gray-900 border rounded-xl p-5"
        >
          <span>服务器时间：</span>
          <span class="text-blue-500">{{ serverTime }}</span>
        </div>
      </div>
    </div>
    <ListProducts />
  </div>
</template>

<style scoped>
.copilot-box {
  background:
    radial-gradient(circle, rgba(68, 181, 161, 1) 5%, rgba(76, 103, 232, 0) 60%)
      201px -83px /200px 200px no-repeat,
    radial-gradient(
        circle,
        rgba(45, 30, 247, 1) 0%,
        rgba(113, 66, 230, 1) 35%,
        rgba(76, 103, 232, 1) 100%
      ) -170px -160px /600px 300px no-repeat;
}

.copilot-box .copilot-green.ant-switch-checked {
  background-color: #1ec7a8;
}
</style>
