import type { ITransactionsRepository, CreateTransactionInput, FindManyTransactionsFilters, Transaction } from '../interfaces/ITransactionsRepository.js'
import { randomUUID } from 'node:crypto'

export class InMemoryTransactionsRepository implements ITransactionsRepository {

  public items: Transaction[] = []

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: randomUUID(),
      user_id: data.user_id,
      bank_account_id: data.bank_account_id ?? null,
      category_id: data.category_id ?? null,
      description: data.description,
      amount: data.amount,
      type: data.type,
      is_paid: data.is_paid ?? false,
      due_date: data.due_date,
      installment_current: data.installment_current ?? null,
      installment_total: data.installment_total ?? null,
      installment_group_id: data.installment_group_id ?? null,
      created_at: new Date(),
    }

    this.items.push(transaction)
    return transaction
  }

  async createMany(data: CreateTransactionInput[]): Promise<Transaction[]> {
    const transactions = await Promise.all(data.map((item) => this.create(item)))
    return transactions
  }

  async findManyByUserId(userId: string, filters?: FindManyTransactionsFilters): Promise<Transaction[]> {
    return this.items.filter((item) => {
      if (item.user_id !== userId) return false
      if (filters?.type && item.type !== filters.type) return false
      if (filters?.bank_account_id && item.bank_account_id !== filters.bank_account_id) return false
      if (filters?.category_id && item.category_id !== filters.category_id) return false
      if (filters?.is_paid !== undefined && item.is_paid !== filters.is_paid) return false
      if (filters?.month && item.due_date.getMonth() + 1 !== filters.month) return false
      if (filters?.year && item.due_date.getFullYear() !== filters.year) return false
      return true
    })
  }
}
