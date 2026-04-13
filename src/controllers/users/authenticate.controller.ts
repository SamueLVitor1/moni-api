
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersRepository } from '../../repositories/users.repository.js'
import { AuthenticateUseCase } from '../../useCases/users/authenticate.js'


export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email('E-mail inválido.'),
    password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new UsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })


    const token = await reply.jwtSign(
      {}, 
      {
        sign: {
          sub: user.id, 
          expiresIn: '7d', 
        },
      }
    )

    return reply.status(200).send({ token })
  } catch (err: any) {
    return reply.status(400).send({ error: err.message })
  }
}