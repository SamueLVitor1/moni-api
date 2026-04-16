import { prisma } from '../database/prisma.js'
import type { IBankAccountsRepository, CreateBankAccountInput, BankAccount } from './interfaces/IBankAccountsRepository.js'

export class BankAccountsRepository implements IBankAccountsRepository {
  async create(data: CreateBankAccountInput): Promise<BankAccount> {
    const bankAccount = await prisma.bank_accounts.create({ 
      data: {
        name: data.name,
        user_id: data.user_id
      }
    })
    
    
    return {
      id: bankAccount.id,
      name: bankAccount.name,
      user_id: bankAccount.user_id,
      created_at: bankAccount.created_at ?? new Date(),
    }
  }

  async findManyByUserId(userId: string): Promise<BankAccount[]> {
    const bankAccounts = await prisma.bank_accounts.findMany({
      where: { user_id: userId },
    })

    return bankAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      user_id: account.user_id,
      created_at: account.created_at ?? new Date(),
    }))
  }
}