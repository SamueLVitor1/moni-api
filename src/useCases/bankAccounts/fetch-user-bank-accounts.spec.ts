import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '../../repositories/in-memory/in-memory-bank-accounts.repository.js'
import { FetchUserBankAccountsUseCase } from './fetch-user-bank-accounts.js'

let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: FetchUserBankAccountsUseCase

describe('Fetch User Bank Accounts Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new FetchUserBankAccountsUseCase(bankAccountsRepository)
  })

  it('deve ser capaz de listar as contas de um usuário específico', async () => {
    await bankAccountsRepository.create({ user_id: 'user-id-01', name: 'Conta Nubank' })
    await bankAccountsRepository.create({ user_id: 'user-id-01', name: 'Conta Inter' })

    const { bankAccounts } = await sut.execute({ userId: 'user-id-01' })

    expect(bankAccounts).toHaveLength(2)
    expect(bankAccounts).toEqual([
      expect.objectContaining({ user_id: 'user-id-01', name: 'Conta Nubank' }),
      expect.objectContaining({ user_id: 'user-id-01', name: 'Conta Inter' }),
    ])
  })

  it('não deve listar contas que pertencem a outro userId', async () => {
    await bankAccountsRepository.create({ user_id: 'user-id-01', name: 'Conta Nubank' })
    await bankAccountsRepository.create({ user_id: 'user-id-02', name: 'Conta Bradesco' })

    const { bankAccounts } = await sut.execute({ userId: 'user-id-01' })

    expect(bankAccounts).toHaveLength(1)
    expect(bankAccounts[0]).toEqual(expect.objectContaining({ user_id: 'user-id-01' }))
  })
})
