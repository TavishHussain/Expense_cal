
export interface Expense {
  id: string;
  date: string;
  item: string;
  amount: number;
  note?: string;
}

export type ViewType = 'dashboard' | 'all-records';
