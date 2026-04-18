import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '../../repositories/in-memory/in-memory-bank-accounts.repository.js'
import { UpdateBankAccountUseCase } from './update-bank-account.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: UpdateBankAccountUseCase

describe('Update Bank Account Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new UpdateBankAccountUseCase(bankAccountsRepository)
  })

  it('deve conseguir atualizar o nome de uma conta bancária', async () => {
    const created = await bankAccountsRepository.create({
      user_id: 'user-id-01',
      name: 'Conta Nubank',
    })

    const { bankAccount } = await sut.execute({
      id: created.id,
      userId: 'user-id-01',
      name: 'Nubank Atualizado',
    })

    expect(bankAccount.name).toEqual('Nubank Atualizado')
    expect(bankAccount.id).toEqual(created.id)
  })

  it('não deve conseguir atualizar uma conta inexistente', async () => {
    await expect(() =>
      sut.execute({ id: 'id-inexistente', userId: 'user-id-01', name: 'Teste' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('não deve conseguir atualizar uma conta que pertence a outro usuário', async () => {
    const created = await bankAccountsRepository.create({
      user_id: 'user-id-01',
      name: 'Conta Nubank',
    })

    await expect(() =>
      sut.execute({ id: created.id, userId: 'user-id-02', name: 'Tentativa' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
