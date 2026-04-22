import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '../../repositories/in-memory/in-memory-transactions.repository.js'
import { CreateTransactionUseCase } from './create-transaction.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new CreateTransactionUseCase(transactionsRepository)
  })

  it('deve criar uma transação simples (sem parcelamento)', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Almoço',
      amount: 35.90,
      type: 'EXPENSE',
      isPaid: true,
      dueDate: new Date('2025-04-01'),
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0]!.installment_total).toBeNull()
    expect(transactions[0]!.installment_group_id).toBeNull()
  })

  it('deve criar N parcelas quando installmentTotal > 1', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Notebook',
      amount: 500,
      type: 'EXPENSE',
      dueDate: new Date('2025-04-01'),
      installmentTotal: 3,
    })

    expect(transactions).toHaveLength(3)
    expect(transactionsRepository.items).toHaveLength(3)
  })

  it('todas as parcelas devem compartilhar o mesmo installment_group_id', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Notebook',
      amount: 500,
      type: 'EXPENSE',
      dueDate: new Date('2025-04-01'),
      installmentTotal: 3,
    })

    const groupId = transactions[0]!.installment_group_id
    expect(groupId).toEqual(expect.any(String))
    expect(transactions.every((t) => t.installment_group_id === groupId)).toBe(true)
  })

  it('deve numerar as parcelas corretamente (installment_current e installment_total)', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Viagem',
      amount: 300,
      type: 'EXPENSE',
      dueDate: new Date('2025-04-01'),
      installmentTotal: 3,
    })

    expect(transactions[0]!.installment_current).toBe(1)
    expect(transactions[1]!.installment_current).toBe(2)
    expect(transactions[2]!.installment_current).toBe(3)
    expect(transactions[0]!.installment_total).toBe(3)
  })

  it('deve incrementar o due_date mês a mês nas parcelas', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Viagem',
      amount: 300,
      type: 'EXPENSE',
      dueDate: new Date('2025-04-10'),
      installmentTotal: 3,
    })

    expect(transactions[0]!.due_date).toEqual(new Date('2025-04-10'))
    expect(transactions[1]!.due_date).toEqual(new Date('2025-05-10'))
    expect(transactions[2]!.due_date).toEqual(new Date('2025-06-10'))
  })

  it('apenas a primeira parcela herda o isPaid, as demais são false', async () => {
    const { transactions } = await sut.execute({
      userId: 'user-id-01',
      description: 'Notebook',
      amount: 500,
      type: 'EXPENSE',
      isPaid: true,
      dueDate: new Date('2025-04-01'),
      installmentTotal: 3,
    })

    expect(transactions[0]!.is_paid).toBe(true)
    expect(transactions[1]!.is_paid).toBe(false)
    expect(transactions[2]!.is_paid).toBe(false)
  })
})
