import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { BankAccountsRepository } from '../../repositories/bank-accounts.repository.js'
import { DeleteBankAccountUseCase } from '../../useCases/bankAccounts/delete-bank-account.js'

export async function deleteBankAccount(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const userId = request.user.sub

  const bankAccountsRepository = new BankAccountsRepository()
  const deleteBankAccountUseCase = new DeleteBankAccountUseCase(bankAccountsRepository)

  await deleteBankAccountUseCase.execute({ id, userId })

  return reply.status(204).send()
}
