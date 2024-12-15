export type TransactionCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Transaction {
  id: number;
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: string;
  note: string;
  timestamp: number;
}
