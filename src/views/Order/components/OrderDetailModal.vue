<script lang="ts" name="OrderDetailModal" setup>
import { onMounted, ref } from 'vue';
import { APIOrderDetailResponse, getOrderDetail } from '@/api/order.ts';

const props = defineProps<{
  currentId: string;
}>();

const visible = defineModel('visible', { type: Boolean });

const detail = ref<APIOrderDetailResponse>({
  buy_ip: '',
  buy_num: 0,
  content: '',
  gd_no: '',
  order_no: '',
  pay_price: 0,
  pay_price_label: '',
  payment_channel: null,
  price: 0,
  price_label: '',
  status: 0,
  title: '',
  trade_no: '',
  type: 0,
  type_label: '',
});

const spinning = ref(false);

function getDetail() {
  getOrderDetail(props.currentId)
    .then((res) => {
      detail.value = res;
    })
    .finally(() => {
      spinning.value = false;
    });
}

onMounted(() => {
  getDetail();
});
</script>

<template>
  <a-modal v-model:open="visible" title="订单详情">
    <template #footer></template>

    <a-spin :spinning="spinning">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item />
        <a-form-item label="订单编号" name="source">
          {{ detail.order_no }}
        </a-form-item>
        <a-form-item label="订单标题" name="source">
          {{ detail.title }}
        </a-form-item>
        <a-form-item label="订单类型" name="source">
          {{ detail.type_label }}
        </a-form-item>
        <a-form-item label="付款渠道" name="source">
          {{ detail.payment_channel || '无' }}
        </a-form-item>
        <a-form-item label="订单状态" name="source">
          {{ detail.status }}
        </a-form-item>
        <a-form-item label="第三方事务号" name="source">
          {{ detail.trade_no || '无' }}
        </a-form-item>
        <a-form-item label="购买数量" name="source">
          {{ detail.buy_num }}
        </a-form-item>
        <a-form-item label="下单IP" name="source">
          {{ detail.buy_ip }}
        </a-form-item>
        <a-form-item label="订单金额" name="source">
          {{ detail.price_label }}
        </a-form-item>
        <a-form-item label="订单支付金额" name="source">
          {{ detail.pay_price_label }}
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<style scoped></style>
