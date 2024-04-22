export interface filterLabelItem {
  label: string;
  value: number | string | boolean;
}

export interface filterTable<k> {
  label: string;
  name: keyof k;
  type: string;
  options?: null | filterLabelItem[];
}

export interface APIListResponse<I, P> {
  list: I[];
  total: number;
  limit: number;
  page: number;
  filter: filterTable<P>[];
}
