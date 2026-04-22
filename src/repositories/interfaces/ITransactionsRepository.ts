export type TransactionType = 'EXPENSE' | 'INCOME'

export interface CreateTransactionInput {
  user_id: string
  bank_account_id?: string | null
  category_id?: string | null
  description: string
  amount: number
  type: TransactionType
  is_paid?: boolean
  due_date: Date
  installment_current?: number | null
  installment_total?: number | null
  installment_group_id?: string | null
}

export interface Transaction {
  id: string
  user_id: string
  bank_account_id: string | null
  category_id: string | null
  description: string
  amount: number
  type: TransactionType
  is_paid: boolean
  due_date: Date
  installment_current: number | null
  installment_total: number | null
  installment_group_id: string | null
  created_at: Date
}

export interface ITransactionsRepository {
  create(data: CreateTransactionInput): Promise<Transaction>
  createMany(data: CreateTransactionInput[]): Promise<Transaction[]>
}
