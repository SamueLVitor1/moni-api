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

export interface UpdateBankAccountInput {
  name: string
}

export interface IBankAccountsRepository {
  create(data: CreateBankAccountInput): Promise<BankAccount>
  findManyByUserId(userId: string): Promise<BankAccount[]>
  findById(id: string): Promise<BankAccount | null>
  update(id: string, data: UpdateBankAccountInput): Promise<BankAccount>
  remove(id: string): Promise<void>
}