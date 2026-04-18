import type { IBankAccountsRepository } from '../../repositories/interfaces/IBankAccountsRepository.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

interface DeleteBankAccountUseCaseRequest {
  id: string
  userId: string
}

export class DeleteBankAccountUseCase {

  constructor(private bankAccountsRepository: IBankAccountsRepository) {}

  async execute({ id, userId }: DeleteBankAccountUseCaseRequest) {
    const bankAccount = await this.bankAccountsRepository.findById(id)

    if (!bankAccount || bankAccount.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    await this.bankAccountsRepository.remove(id)
  }
}
