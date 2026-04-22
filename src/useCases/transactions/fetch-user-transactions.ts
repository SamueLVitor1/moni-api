import type { ITransactionsRepository, FindManyTransactionsFilters, TransactionType } from '../../repositories/interfaces/ITransactionsRepository.js'

interface FetchUserTransactionsUseCaseRequest {
  userId: string
  filters?: {
    type?: TransactionType | undefined
    bankAccountId?: string | undefined
    categoryId?: string | undefined
    isPaid?: boolean | undefined
    month?: number | undefined
    year?: number | undefined
  }
}

export class FetchUserTransactionsUseCase {

  constructor(private transactionsRepository: ITransactionsRepository) {}

  async execute({ userId, filters }: FetchUserTransactionsUseCaseRequest) {
    const repositoryFilters: FindManyTransactionsFilters = {
      type: filters?.type,
      bank_account_id: filters?.bankAccountId,
      category_id: filters?.categoryId,
      is_paid: filters?.isPaid,
      month: filters?.month,
      year: filters?.year,
    }

    const transactions = await this.transactionsRepository.findManyByUserId(userId, repositoryFilters)

    return { transactions }
  }
}
