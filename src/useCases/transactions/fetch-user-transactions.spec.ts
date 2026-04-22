import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '../../repositories/in-memory/in-memory-transactions.repository.js'
import { FetchUserTransactionsUseCase } from './fetch-user-transactions.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: FetchUserTransactionsUseCase

describe('Fetch User Transactions Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new FetchUserTransactionsUseCase(transactionsRepository)
  })

  it('deve listar todas as transações do usuário sem filtros', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Almoço', amount: 30, type: 'EXPENSE', is_paid: true, due_date: new Date('2025-04-01') })
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Salário', amount: 5000, type: 'INCOME', is_paid: true, due_date: new Date('2025-04-05') })

    const { transactions } = await sut.execute({ userId: 'user-id-01' })

    expect(transactions).toHaveLength(2)
  })

  it('não deve listar transações de outro usuário', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Almoço', amount: 30, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-01') })
    await transactionsRepository.create({ user_id: 'user-id-02', description: 'Outro', amount: 100, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-01') })

    const { transactions } = await sut.execute({ userId: 'user-id-01' })

    expect(transactions).toHaveLength(1)
  })

  it('deve filtrar por type', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Almoço', amount: 30, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-01') })
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Salário', amount: 5000, type: 'INCOME', is_paid: true, due_date: new Date('2025-04-05') })

    const { transactions } = await sut.execute({ userId: 'user-id-01', filters: { type: 'EXPENSE' } })

    expect(transactions).toHaveLength(1)
    expect(transactions[0]!.type).toEqual('EXPENSE')
  })

  it('deve filtrar por is_paid', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Pago', amount: 50, type: 'EXPENSE', is_paid: true, due_date: new Date('2025-04-01') })
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Pendente', amount: 80, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-10') })

    const { transactions } = await sut.execute({ userId: 'user-id-01', filters: { isPaid: false } })

    expect(transactions).toHaveLength(1)
    expect(transactions[0]!.description).toEqual('Pendente')
  })

  it('deve filtrar por month e year', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Abril', amount: 100, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-15') })
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Maio', amount: 200, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-05-10') })

    const { transactions } = await sut.execute({ userId: 'user-id-01', filters: { month: 4, year: 2025 } })

    expect(transactions).toHaveLength(1)
    expect(transactions[0]!.description).toEqual('Abril')
  })

  it('deve filtrar por bank_account_id', async () => {
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Nubank', amount: 100, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-01'), bank_account_id: 'bank-id-01' })
    await transactionsRepository.create({ user_id: 'user-id-01', description: 'Inter', amount: 200, type: 'EXPENSE', is_paid: false, due_date: new Date('2025-04-01'), bank_account_id: 'bank-id-02' })

    const { transactions } = await sut.execute({ userId: 'user-id-01', filters: { bankAccountId: 'bank-id-01' } })

    expect(transactions).toHaveLength(1)
    expect(transactions[0]!.bank_account_id).toEqual('bank-id-01')
  })
})
