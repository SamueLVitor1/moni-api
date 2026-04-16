export interface CreateBankAccountInput {
  name: string
  user_id: string
}

export interface BankAccount {
  id: string
  name: string
  user_id: string
  created_at: Date
}

export interface IBankAccountsRepository {
  create(data: CreateBankAccountInput): Promise<BankAccount>
  findManyByUserId(userId: string): Promise<BankAccount[]>
}