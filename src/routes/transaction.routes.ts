import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createTransaction } from '../controllers/transactions/create-transaction.controller.js'
import { fetchUserTransactions } from '../controllers/transactions/fetch-user-transactions.controller.js'

const security = [{ bearerAuth: [] }]

export async function transactionRoutes(app: FastifyInstance) {

  app.addHook('onRequest', app.authenticate)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/transactions',
    {
      schema: {
        security,
        tags: ['Transactions'],
        body: z.object({
          bank_account_id: z.uuid().optional().nullable(),
          category_id: z.uuid().optional().nullable(),
          description: z.string().min(1, 'A descrição é obrigatória.'),
          amount: z.number().positive('O valor deve ser positivo.'),
          type: z.enum(['EXPENSE', 'INCOME']),
          is_paid: z.boolean().optional(),
          due_date: z.coerce.date(),
          installment_total: z.number().int().min(2).optional(),
        }),
      },
    },
    createTransaction
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/transactions',
    {
      schema: {
        security,
        tags: ['Transactions'],
        querystring: z.object({
          type: z.enum(['EXPENSE', 'INCOME']).optional(),
          bank_account_id: z.uuid().optional(),
          category_id: z.uuid().optional(),
          is_paid: z.coerce.boolean().optional(),
          month: z.coerce.number().int().min(1).max(12).optional(),
          year: z.coerce.number().int().optional(),
        }),
      },
    },
    fetchUserTransactions
  )
}
