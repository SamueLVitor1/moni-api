import type { IBankAccountsRepository } from '../../repositories/interfaces/IBankAccountsRepository.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

interface UpdateBankAccountUseCaseRequest {
  id: string
  userId: string
  name: string
}

export class UpdateBankAccountUseCase {

  constructor(private bankAccountsRepository: IBankAccountsRepository) {}

  async execute({ id, userId, name }: UpdateBankAccountUseCaseRequest) {
    const bankAccount = await this.bankAccountsRepository.findById(id)

    if (!bankAccount || bankAccount.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    const updated = await this.bankAccountsRepository.update(id, { name })

    return { bankAccount: updated }
  }
}
