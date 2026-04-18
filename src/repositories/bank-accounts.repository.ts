import { prisma } from '../database/prisma.js'
import type { IBankAccountsRepository, CreateBankAccountInput, UpdateBankAccountInput, BankAccount } from './interfaces/IBankAccountsRepository.js'

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

  async findById(id: string): Promise<BankAccount | null> {
    const account = await prisma.bank_accounts.findUnique({ where: { id } })

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      user_id: account.user_id,
      created_at: account.created_at ?? new Date(),
    }
  }

  async update(id: string, data: UpdateBankAccountInput): Promise<BankAccount> {
    const account = await prisma.bank_accounts.update({
      where: { id },
      data: { name: data.name },
    })

    return {
      id: account.id,
      name: account.name,
      user_id: account.user_id,
      created_at: account.created_at ?? new Date(),
    }
  }
}