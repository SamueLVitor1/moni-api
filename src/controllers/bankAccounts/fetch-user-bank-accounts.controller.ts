import type { FastifyReply, FastifyRequest } from 'fastify'
import { BankAccountsRepository } from '../../repositories/bank-accounts.repository.js'
import { FetchUserBankAccountsUseCase } from '../../useCases/bankAccounts/fetch-user-bank-accounts.js'

export async function fetchUserBankAccounts(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const bankAccountsRepository = new BankAccountsRepository()
  const fetchUserBankAccountsUseCase = new FetchUserBankAccountsUseCase(bankAccountsRepository)

  const { bankAccounts } = await fetchUserBankAccountsUseCase.execute({ userId })

  return reply.status(200).send({ bankAccounts })
}
