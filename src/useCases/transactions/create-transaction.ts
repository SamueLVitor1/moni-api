import { randomUUID } from 'node:crypto'
import type { ITransactionsRepository, CreateTransactionInput, TransactionType } from '../../repositories/interfaces/ITransactionsRepository.js'

interface CreateTransactionUseCaseRequest {
  userId: string
  bankAccountId?: string | null
  categoryId?: string | null
  description: string
  amount: number
  type: TransactionType
  isPaid?: boolean
  dueDate: Date
  installmentTotal?: number | undefined
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export class CreateTransactionUseCase {

  constructor(private transactionsRepository: ITransactionsRepository) {}

  async execute({
    userId,
    bankAccountId,
    categoryId,
    description,
    amount,
    type,
    isPaid,
    dueDate,
    installmentTotal,
  }: CreateTransactionUseCaseRequest) {
    const isInstallment = installmentTotal && installmentTotal > 1

    if (!isInstallment) {
      const transaction = await this.transactionsRepository.create({
        user_id: userId,
        bank_account_id: bankAccountId ?? null,
        category_id: categoryId ?? null,
        description,
        amount,
        type,
        is_paid: isPaid ?? false,
        due_date: dueDate,
      })

      return { transactions: [transaction] }
    }

    const groupId = randomUUID()

    const installments: CreateTransactionInput[] = Array.from(
      { length: installmentTotal },
      (_, i) => ({
        user_id: userId,
        bank_account_id: bankAccountId ?? null,
        category_id: categoryId ?? null,
        description: `${description} (${i + 1}/${installmentTotal})`,
        amount,
        type,
        is_paid: i === 0 ? (isPaid ?? false) : false,
        due_date: addMonths(dueDate, i),
        installment_current: i + 1,
        installment_total: installmentTotal,
        installment_group_id: groupId,
      })
    )

    const transactions = await this.transactionsRepository.createMany(installments)

    return { transactions }
  }
}
