<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useSize } from 'vue-hooks-plus';
import { message } from 'ant-design-vue';
import {
  APIGetCoinsResponseItem,
  APIGetCopilotServiceResponse,
  APIGetUsageRecordsResponseItem,
  changeCopilotService,
  getCoins,
  getCopilotService,
  getUsageRecords,
  useRedemptionCode,
} from '@/api/purse.ts';
import { useUserStore } from '@/store/user.ts';
import { duration } from '@/utils/format.ts';
import ListProducts from '@/views/Home/components/ListProducts.vue';

const serverRef = ref();
const size = useSize(serverRef);
const userStore = useUserStore();

const copilotInfo = ref<APIGetCopilotServiceResponse>({
  paused_time: undefined,
  remaining_time: 0,
  start_time: undefined,
  is_paused: 1,
});

function getCopilotInfo() {
  getCopilotService().then((res) => {
    copilotInfo.value = res;
  });
}

const changeCopilotStatusLoading = ref(false);

function updateCopilotStatus() {
  changeCopilotStatusLoading.value = true;
  changeCopilotService()
    .then((res) => {
      copilotInfo.value.is_paused = res.is_paused;
    })
    .finally(() => {
      changeCopilotStatusLoading.value = false;
    });
}

const coinList = ref<APIGetCoinsResponseItem[]>([]);

function getCoinList() {
  getCoins().then((res) => {
    coinList.value = res;
  });
}

const redemptionCode = ref('');
const useRedemptionCodeLoading = ref(false);

// 使用兑换码
function useExchangeCode() {
  useRedemptionCodeLoading.value = true;
  useRedemptionCode(redemptionCode.value)
    .then(() => {
      redemptionCode.value = '';
      message.success('兑换成功');
    })
    .finally(() => {
      useRedemptionCodeLoading.value = false;
    });
}

const copilotSessionList = ref<APIGetUsageRecordsResponseItem[]>([]);

function getCopilotRecharge() {
  getUsageRecords({ status: 'ACTIVE' }).then((res) => {
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
    <div v-if="userStore.account_id" class="flex w-[1200px] gap-5 pt-5">
      <!--      <div class="bg-white w-[300px] border rounded-xl flex-shrink-0">公告</div>-->

      <div
        :style="{
          height: size.height + 'px',
        }"
        class="flex-1 max-h-[352px] overflow-auto scrollbar-width-none bg-white border rounded-xl"
      >
        <div class="p-5 flex justify-between items-center">
          <h4>套餐</h4>
          <router-link to="/copilot-package"
            ><span class="text-blue-500 cursor-pointer">更多</span></router-link
          >
        </div>
        <template v-for="item in copilotSessionList" :key="item.source">
          <a-divider class="m-0" />
          <div class="hover:bg-gray-100 p-5">
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
                  duration(item.recharge_time - +(item.reason || '0'), 'second')
                }}</span
              >
              <span
                >已使用：{{ duration(+(item.reason || '0'), 'second') }}</span
              >
            </div>
          </div>
        </template>
      </div>

      <div ref="serverRef" class="w-[300px] flex flex-col gap-5 flex-shrink-0">
        <div class="bg-white border rounded-xl p-5">
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
              <span class="text-gray-600">{{ item.type_label }}</span>
              <span>{{ item.balance_label }}</span>
            </li>
            <li class="flex flex-col justify-between gap-2">
              <a-input v-model:value="redemptionCode" placeholder="兑换码" />
              <a-button
                :loading="useRedemptionCodeLoading"
                type="primary"
                @click="useExchangeCode"
                >充值
              </a-button>
            </li>
          </ul>
        </div>
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
              <a-statistic
                v-if="copilotInfo.is_paused === 1"
                :value="duration(copilotInfo.remaining_time)"
                :value-style="{ color: '#E5E7EB' }"
              />
              <a-statistic-countdown
                v-else
                :value="copilotInfo.remaining_time"
                :value-style="{ color: '#E5E7EB' }"
                format="HH:mm:ss"
              />
            </li>
          </ul>
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
      ) -170px -160px /500px 300px no-repeat;
}

.copilot-box .copilot-green.ant-switch-checked {
  background-color: #1ec7a8;
}
</style>
