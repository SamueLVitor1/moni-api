import type { IBankAccountsRepository } from '../../repositories/interfaces/IBankAccountsRepository.js'

interface CreateBankAccountUseCaseRequest {
  userId: string
  name: string
}

export class CreateBankAccountUseCase {

  constructor(private bankAccountsRepository: IBankAccountsRepository) {}

  async execute({ userId, name }: CreateBankAccountUseCaseRequest) {
    
    const bankAccount = await this.bankAccountsRepository.create({
      name,
      user_id: userId, 
    })

    return { bankAccount }
  }
}