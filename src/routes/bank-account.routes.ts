import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createBankAccount } from '../controllers/bankAccounts/bank-account.controller.js'
import { fetchUserBankAccounts } from '../controllers/bankAccounts/fetch-user-bank-accounts.controller.js'
import { updateBankAccount } from '../controllers/bankAccounts/update-bank-account.controller.js'

export async function bankAccountRoutes(app: FastifyInstance) {

  app.addHook('onRequest', app.authenticate)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/bank-accounts',
    {
      schema: {
        body: z.object({
          name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    createBankAccount
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/bank-accounts',
    {},
    fetchUserBankAccounts
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/bank-accounts/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    updateBankAccount
  )
}
