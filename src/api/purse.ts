import { APIListResponse } from '@/interface/common.ts';
import request from '@/utils/request.ts';

export function useRedemptionCode(code: string) {
  return request({
    url: `/api/use/redemption_code/${code}`,
    method: 'POST',
  });
}

export interface APIGetCoinsResponseItem {
  type: number;
  type_label: string;
  balance: number;
  balance_label: string;
}

export function getCoins() {
  return request<APIGetCoinsResponseItem[]>({
    url: '/api/coin',
  });
}

export interface APIGetCoinParams {
  status?: number | null;
  is_use?: string;
  start_time?: string;
  end_time?: string;
  limit: number;
  page: number;
}

export interface APIGetCoinResponseItem {
  id: 2;
  num: string;
  balance: string;
  content: string;
  expire_time?: string | null;
  is_use: number;
  is_use_label: string;
  created_at: string;
}

export interface APIGetCoinResponse
  extends APIListResponse<APIGetCoinResponseItem, APIGetCoinParams> {}

export function getCoin(type: number, data: APIGetCoinParams) {
  return request<APIGetCoinResponse>({
    url: `/api/coin/${type}`,
    data,
  });
}

export interface APIGetUsageRecordsParams {
  status?: string | null;
  start_time?: string;
  end_time?: string;
  page?: number;
  limit?: number;
  order_by?: 'desc' | 'asc';
}

export interface APIGetUsageRecordsResponseItem {
  // 充值时间 单位秒
  recharge_time: number;
  // 充值格式化时间 小时
  recharge_time_label: string;
  // 当前数据活动状态
  status: string;
  // 活动状态展示
  status_label: string;
  // 数据来源备注
  source: string;
  // 数据原因
  reason: string | null;
  percent?: number;
  reason_label?: string;
  // 过期时间，如果null，则永不过期
  expire_time: string | null;
  // 创建时间
  created_at: string;
}

export interface APIGetUsageRecordsResponse
  extends APIListResponse<
    APIGetUsageRecordsResponseItem,
    APIGetUsageRecordsParams
  > {}

export function getUsageRecords(data: APIGetUsageRecordsParams) {
  return request<APIGetUsageRecordsResponse>({
    url: '/api/service/copilot/recharge',
    params: data,
  });
}

export interface APIGetCopilotServiceResponse {
  // 剩余时间秒
  remaining_time: number;
  // 是否暂停 1 是 0 否
  is_paused: number;
  paused_time?: string | null;
  start_time?: string | null;
}

export function getCopilotService() {
  return request<APIGetCopilotServiceResponse>({
    url: '/api/service/copilot',
  });
}

export interface APIChangeCopilotServiceResponse {
  is_paused: number; // 是否暂停 1 是 0 否
  remaining_time: number; // 剩余时间 单位秒
  update_time: string;
}

export function changeCopilotService() {
  return request<APIChangeCopilotServiceResponse>({
    url: '/api/service/copilot/switch',
    method: 'POST',
  });
}

export interface APIGetCopilotSessionParams {
  page: number;
  limit: number;
  start_time?: string;
  end_time?: string;
}

export interface APIGetCopilotSessionResponseItem {
  session_no: string;
  start_time: string;
  end_time: string;
  total_time: number;
  total_req: number;
  total_chat_req: number;
  total_prompt_req: number;
  created_at: string;
  total_time_label: string; // 使用时间
  total_req_label: string; // 请求次数（包含chat、prom）
  total_req_chat_label: string; // 请求次数 仅对话
  total_prompt_req_label: string; // 请求次数 仅代码提示
}

export function getCopilotSession(params: APIGetCopilotSessionParams) {
  return request<
    APIListResponse<
      APIGetCopilotSessionResponseItem,
      APIGetCopilotSessionParams
    >
  >({
    url: '/api/service/copilot/sessions',
    params,
  });
}
