import { compare } from 'bcryptjs'
import type { IUsersRepository } from '../../repositories/interfaces/IUsersRepository.js'

interface AuthenticateUseCaseRequest {
  email: string
  password: string 
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest) {

    // Busca a usuária(o) pelo e-mail
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new Error('Credenciais inválidas.')
    }

    // Compara a senha digitada com o hash salvo no banco
    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new Error('Credenciais inválidas.')
    }

    return { user }
  }
}