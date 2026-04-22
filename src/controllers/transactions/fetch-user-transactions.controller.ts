import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { TransactionsRepository } from '../../repositories/transactions.repository.js'
import { FetchUserTransactionsUseCase } from '../../useCases/transactions/fetch-user-transactions.js'

export async function fetchUserTransactions(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    type: z.enum(['EXPENSE', 'INCOME']).optional(),
    bank_account_id: z.uuid().optional(),
    category_id: z.uuid().optional(),
    is_paid: z.coerce.boolean().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().optional(),
  })

  const { type, bank_account_id, category_id, is_paid, month, year } = querySchema.parse(request.query)

  const userId = request.user.sub

  const transactionsRepository = new TransactionsRepository()
  const fetchUserTransactionsUseCase = new FetchUserTransactionsUseCase(transactionsRepository)

  const { transactions } = await fetchUserTransactionsUseCase.execute({
    userId,
    filters: { type, bankAccountId: bank_account_id, categoryId: category_id, isPaid: is_paid, month, year },
  })

  return reply.status(200).send({ transactions })
}
