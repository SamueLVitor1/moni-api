import { prisma } from '../database/prisma.js'
import type { IUsersRepository, CreateUserInput, User } from './interfaces/IUsersRepository.js'

export class UsersRepository implements IUsersRepository {
  async create(data: CreateUserInput): Promise<User> {
    const user = await prisma.users.create({ data })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at ?? new Date(),
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.users.findUnique({ where: { email } })

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at ?? new Date(),
    }
  }
}
