import { APIListResponse } from '@/interface/common.ts';
import request from '@/utils/request.ts';

export interface createOrderParams {
  gd_no: string; // 购买商品编号
  buy_num: number; // 购买数量
  other_ipu: {
    // 商品配置的其他填入信息
    [key: string]: number | string;
  };
}

export function createOrder(data: createOrderParams) {
  return request<{
    order_no: string;
  }>({
    url: '/api/order',
    method: 'POST',
    data,
  });
}

export interface getOrderStatusParams {
  payCheck: string;
  orderNo: string;
}

export function getBuyAddress(data: getOrderStatusParams) {
  return request<{ hook_url: string }>({
    url: `/api/pay-gateway/${data.payCheck}/${data.orderNo}`,
    method: 'POST',
    hideError: true,
  });
}

export interface APIGetPayTypeItem {
  pay_name: string; // 支付渠道
  pay_check: string; // 支付标识
  pay_method: number; // 支付方式 1 跳转 2 扫码
  pay_client: number; // 支付场景 1电脑 2手机 3全部
}

export function getPayType() {
  return request<APIGetPayTypeItem[]>({
    url: '/api/pay',
  });
}

export interface APIOrderResponseItem {
  order_no: 'R2024041002572169695'; // 订单编号
  gd_no: 'co24g8bbgh7g026t113g'; // 商品编号
  title: 'Copilot服务套餐-3H'; //订单标题
  type: 1; // 订单类型
  payment_channel: null; // 付款渠道
  trade_no: ''; // 第三方事务号
  buy_num: 1; // 购买数量
  status: 200; // 订单状态
  created_at: '2024-04-10 02:57:21'; // 创建时间
  updated_at: '2024-04-10 05:54:16'; // 更新时间
  price: 300; // 订单金额
  pay_price: 300; // 订单支付金额
  status_label: '已支付';
  type_label: '自动发货';
  price_label: '3银币,0铜币';
  pay_price_label: '3银币,0铜币';
}

export interface APIOrderParams {
  order_no: string;
  gd_no: string;
  type?: number;
  status?: number;
  start_time: string;
  end_time: string;
  limit: number;
  page: number;
}

export interface APIOrderResponse
  extends APIListResponse<APIOrderResponseItem, APIOrderParams> {}

export function getOrderList(params: APIOrderParams) {
  return request<APIOrderResponse>({
    url: '/api/order',
    params,
  });
}

export interface APIOrderDetailResponse {
  order_no: string;
  gd_no: string;
  title: string;
  type: number;
  type_label: string;
  price: number;
  price_label: string;
  pay_price: number;
  pay_price_label: string;
  payment_channel: null;
  trade_no: string;
  content: string;
  buy_ip: string;
  buy_num: number;
  status: number;
}

export function getOrderDetail(orderNo: string) {
  return request<APIOrderDetailResponse>({
    url: `/api/order/${orderNo}`,
  });
}
