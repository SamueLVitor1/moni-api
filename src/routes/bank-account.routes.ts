import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createBankAccount } from '../controllers/bankAccounts/bank-account.controller.js'
import { fetchUserBankAccounts } from '../controllers/bankAccounts/fetch-user-bank-accounts.controller.js'
import { updateBankAccount } from '../controllers/bankAccounts/update-bank-account.controller.js'
import { deleteBankAccount } from '../controllers/bankAccounts/delete-bank-account.controller.js'

const security = [{ bearerAuth: [] }]

export async function bankAccountRoutes(app: FastifyInstance) {

  app.addHook('onRequest', app.authenticate)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/bank-accounts',
    {
      schema: {
        security,
        tags: ['Bank Accounts'],
        body: z.object({
          name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    createBankAccount
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/bank-accounts',
    {
      schema: {
        security,
        tags: ['Bank Accounts'],
      },
    },
    fetchUserBankAccounts
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/bank-accounts/:id',
    {
      schema: {
        security,
        tags: ['Bank Accounts'],
        params: z.object({ id: z.uuid() }),
        body: z.object({
          name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    updateBankAccount
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/bank-accounts/:id',
    {
      schema: {
        security,
        tags: ['Bank Accounts'],
        params: z.object({ id: z.uuid() }),
      },
    },
    deleteBankAccount
  )
}
