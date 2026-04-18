import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '../../repositories/in-memory/in-memory-bank-accounts.repository.js'
import { DeleteBankAccountUseCase } from './delete-bank-account.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: DeleteBankAccountUseCase

describe('Delete Bank Account Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new DeleteBankAccountUseCase(bankAccountsRepository)
  })

  it('deve conseguir deletar uma conta bancária', async () => {
    const created = await bankAccountsRepository.create({
      user_id: 'user-id-01',
      name: 'Conta Nubank',
    })

    await sut.execute({ id: created.id, userId: 'user-id-01' })

    expect(bankAccountsRepository.items).toHaveLength(0)
  })

  it('não deve conseguir deletar uma conta inexistente', async () => {
    await expect(() =>
      sut.execute({ id: 'id-inexistente', userId: 'user-id-01' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('não deve conseguir deletar uma conta que pertence a outro usuário', async () => {
    const created = await bankAccountsRepository.create({
      user_id: 'user-id-01',
      name: 'Conta Nubank',
    })

    await expect(() =>
      sut.execute({ id: created.id, userId: 'user-id-02' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(bankAccountsRepository.items).toHaveLength(1)
  })
})
