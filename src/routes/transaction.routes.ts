import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createTransaction } from '../controllers/transactions/create-transaction.controller.js'

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
}
