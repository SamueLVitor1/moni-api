import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { BankAccountsRepository } from '../../repositories/bank-accounts.repository.js'
import { UpdateBankAccountUseCase } from '../../useCases/bankAccounts/update-bank-account.js'

export async function updateBankAccount(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
  })

  const { id } = paramsSchema.parse(request.params)
  const { name } = bodySchema.parse(request.body)
  const userId = request.user.sub

  const bankAccountsRepository = new BankAccountsRepository()
  const updateBankAccountUseCase = new UpdateBankAccountUseCase(bankAccountsRepository)

  const { bankAccount } = await updateBankAccountUseCase.execute({ id, userId, name })

  return reply.status(200).send({ bankAccount })
}
