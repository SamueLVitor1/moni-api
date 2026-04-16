import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { BankAccountsRepository } from '../../repositories/bank-accounts.repository.js'
import { CreateBankAccountUseCase } from '../../useCases/bankAccounts/create-bank-account.js'

export async function createBankAccount(request: FastifyRequest, reply: FastifyReply) {
  const createBankAccountBodySchema = z.object({
    name: z.string().min(2, 'O nome da conta precisa ter pelo menos 2 letras.'),
  })

  const { name } = createBankAccountBodySchema.parse(request.body)

  const userId = request.user.sub

  const bankAccountsRepository = new BankAccountsRepository()
  const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountsRepository)

  const { bankAccount } = await createBankAccountUseCase.execute({ userId, name })

  return reply.status(201).send({ bankAccount })
}
