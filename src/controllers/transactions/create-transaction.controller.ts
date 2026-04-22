import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { TransactionsRepository } from '../../repositories/transactions.repository.js'
import { CreateTransactionUseCase } from '../../useCases/transactions/create-transaction.js'

export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    bank_account_id: z.uuid().optional().nullable(),
    category_id: z.uuid().optional().nullable(),
    description: z.string().min(1, 'A descrição é obrigatória.'),
    amount: z.number().positive('O valor deve ser positivo.'),
    type: z.enum(['EXPENSE', 'INCOME']),
    is_paid: z.boolean().optional(),
    due_date: z.coerce.date(),
    installment_total: z.number().int().min(2).optional(),
  })

  const { bank_account_id, category_id, description, amount, type, is_paid, due_date, installment_total } =
    bodySchema.parse(request.body)

  const userId = request.user.sub

  const transactionsRepository = new TransactionsRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(transactionsRepository)

  const { transactions } = await createTransactionUseCase.execute({
    userId,
    bankAccountId: bank_account_id ?? null,
    categoryId: category_id ?? null,
    description,
    amount,
    type,
    isPaid: is_paid ?? false,
    dueDate: due_date,
    installmentTotal: installment_total,
  })

  return reply.status(201).send({ transactions })
}
