import { APIListResponse } from '@/interface/common.ts';
import request from '@/utils/request.ts';

export interface goodListParams {
  limit: number;
  page: number;
  search_value: string;
}

export interface goodListItem {
  // 商品唯一ID
  gd_no: string;
  // 商品名称
  gd_name: string;
  // 商品关键字、标签、tag
  gd_keywords: string[];
  // 商品图片
  picture: string;
  // 无意义，商品类型
  type: 1;
  // 商品成本价格 单位铜币
  actual_price: number;
  // 商品成本展示价格
  actual_price_label: string;
  // 商品售卖价格 单位铜币
  retail_price: number;
  // 展示商品售卖价格
  retail_price_label: string;
  // 商品销量
  sales_volume: number;
  // 商品库存
  in_stock: number;
  // 是否自动发货
  is_automatic: number;
  // 权重
  ord: number;
  // 商品限购数量 0 不限制 数字则是限购数量
  buy_limit_num: number;
  // 商品创建时间
  created_at: string;
}

export interface goodListResponse
  extends APIListResponse<goodListItem, goodListParams> {}

export function getGoodList(params: goodListParams) {
  return request<goodListResponse>({
    url: '/api/good',
    params,
  });
}

export interface goodDetail extends goodListItem {
  // 商品描述
  gd_description: string;
  // 商品权重
  ord: number;
  // 购买提示
  buy_prompt: string;
  // 购买前检查地址 如果存在域名则直接请求，如果不存在域名则携带api请求域名检查
  pre_api_hook?: string;
  // 是否需要其他输入框 详情参照后台
  other_ipu_cnf: string[];
  // 批发价格、详情参照后台
  wholesale_price_cnf: string[];
  // 商品单价展示
  actual_price_label: string;
}

export function getGoodDetail(gd_no: string) {
  return request<goodDetail>({
    url: `/api/good/${gd_no}`,
  });
}
