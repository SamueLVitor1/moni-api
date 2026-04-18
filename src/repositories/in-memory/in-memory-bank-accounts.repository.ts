import type { IBankAccountsRepository, CreateBankAccountInput, UpdateBankAccountInput, BankAccount } from '../interfaces/IBankAccountsRepository.js'
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

  async findManyByUserId(userId: string): Promise<BankAccount[]> {
    return this.items.filter((item) => item.user_id === userId)
  }

  async findById(id: string): Promise<BankAccount | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async update(id: string, data: UpdateBankAccountInput): Promise<BankAccount> {
    const index = this.items.findIndex((item) => item.id === id)
    this.items[index] = { ...this.items[index]!, ...data }
    return this.items[index]!
  }
}