import type { IBankAccountsRepository } from '../../repositories/interfaces/IBankAccountsRepository.js'

interface FetchUserBankAccountsUseCaseRequest {
  userId: string
}

export class FetchUserBankAccountsUseCase {

  constructor(private bankAccountsRepository: IBankAccountsRepository) {}

  async execute({ userId }: FetchUserBankAccountsUseCaseRequest) {
    const bankAccounts = await this.bankAccountsRepository.findManyByUserId(userId)

    return { bankAccounts }
  }
}
