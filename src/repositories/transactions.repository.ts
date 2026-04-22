import { prisma } from '../database/prisma.js'
import type { ITransactionsRepository, CreateTransactionInput, Transaction, TransactionType } from './interfaces/ITransactionsRepository.js'

export class TransactionsRepository implements ITransactionsRepository {
  async create(data: CreateTransactionInput): Promise<Transaction> {
    const transaction = await prisma.transactions.create({
      data: {
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
      },
    })

    return {
      id: transaction.id,
      user_id: transaction.user_id,
      bank_account_id: transaction.bank_account_id,
      category_id: transaction.category_id,
      description: transaction.description,
      amount: Number(transaction.amount),
      type: transaction.type as TransactionType,
      is_paid: transaction.is_paid ?? false,
      due_date: transaction.due_date,
      installment_current: transaction.installment_current,
      installment_total: transaction.installment_total,
      installment_group_id: transaction.installment_group_id,
      created_at: transaction.created_at ?? new Date(),
    }
  }

  private toEntity(row: Awaited<ReturnType<typeof prisma.transactions.create>>): Transaction {
    return {
      id: row.id,
      user_id: row.user_id,
      bank_account_id: row.bank_account_id,
      category_id: row.category_id,
      description: row.description,
      amount: Number(row.amount),
      type: row.type as TransactionType,
      is_paid: row.is_paid ?? false,
      due_date: row.due_date,
      installment_current: row.installment_current,
      installment_total: row.installment_total,
      installment_group_id: row.installment_group_id,
      created_at: row.created_at ?? new Date(),
    }
  }

  async createMany(data: CreateTransactionInput[]): Promise<Transaction[]> {
    const rows = await prisma.$transaction(
      data.map((item) =>
        prisma.transactions.create({
          data: {
            user_id: item.user_id,
            bank_account_id: item.bank_account_id ?? null,
            category_id: item.category_id ?? null,
            description: item.description,
            amount: item.amount,
            type: item.type,
            is_paid: item.is_paid ?? false,
            due_date: item.due_date,
            installment_current: item.installment_current ?? null,
            installment_total: item.installment_total ?? null,
            installment_group_id: item.installment_group_id ?? null,
          },
        })
      )
    )

    return rows.map((row) => this.toEntity(row))
  }
}
