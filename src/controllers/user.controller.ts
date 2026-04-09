import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersRepository } from '../repositories/users.repository.js'
import { CreateUserUseCase } from '../useCases/users/create-user.js' 

export async function register(request: FastifyRequest, reply: FastifyReply) {

  const registerBodySchema = z.object({
    name: z.string().min(2, 'O nome precisa ter pelo menos 2 letras.'),
    email: z.string().email('E-mail inválido.'),
    password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
  })


  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new UsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    await createUserUseCase.execute({
      name,
      email,
      password,
    })

    return reply.status(201).send({ message: 'Usuária(o) criada(o) com sucesso! 🎉' })
  } catch (err: any) {
    return reply.status(409).send({ error: err.message })
  }
}