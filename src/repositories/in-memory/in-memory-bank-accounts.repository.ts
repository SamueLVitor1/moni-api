import type { IBankAccountsRepository, CreateBankAccountInput, BankAccount } from '../interfaces/IBankAccountsRepository.js'
import { randomUUID } from 'node:crypto'

export class InMemoryBankAccountsRepository implements IBankAccountsRepository {
  public items: BankAccount[] = []

  async create(data: CreateBankAccountInput): Promise<BankAccount> {
    const bankAccount: BankAccount = {
      id: randomUUID(),
      user_id: data.user_id,
      name: data.name,
      created_at: new Date(),
    }

    this.items.push(bankAccount)
    return bankAccount
  }
}