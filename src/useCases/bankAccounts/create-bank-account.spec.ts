import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '../../repositories/in-memory/in-memory-bank-accounts.repository.js'
import { CreateBankAccountUseCase } from './create-bank-account.js'

let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: CreateBankAccountUseCase

describe('Create Bank Account Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new CreateBankAccountUseCase(bankAccountsRepository)
  })

  it('deve conseguir criar uma nova conta bancária', async () => {
    const { bankAccount } = await sut.execute({
      userId: 'user-id-01',
      name: 'Conta Nubank',
    })

    expect(bankAccount.id).toEqual(expect.any(String))
    expect(bankAccount.name).toEqual('Conta Nubank')
    expect(bankAccount.user_id).toEqual('user-id-01')
  })

  it('deve persistir a conta bancária no repositório', async () => {
    await sut.execute({
      userId: 'user-id-01',
      name: 'Conta Inter',
    })

    expect(bankAccountsRepository.items).toHaveLength(1)
    expect(bankAccountsRepository.items[0]?.name).toEqual('Conta Inter')
  })

  it('deve permitir que um mesmo usuário crie múltiplas contas bancárias', async () => {
    await sut.execute({ userId: 'user-id-01', name: 'Conta Nubank' })
    await sut.execute({ userId: 'user-id-01', name: 'Conta Inter' })

    expect(bankAccountsRepository.items).toHaveLength(2)
  })
})
