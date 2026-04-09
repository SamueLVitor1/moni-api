import { hash } from 'bcryptjs'
import type { IUsersRepository } from '../../repositories/interfaces/IUsersRepository.js' 

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string 
}

export class CreateUserUseCase {
  
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: CreateUserUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail já cadastrado.')
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}