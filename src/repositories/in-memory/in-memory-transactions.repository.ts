import type { ITransactionsRepository, CreateTransactionInput, Transaction } from '../interfaces/ITransactionsRepository.js'
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
}
