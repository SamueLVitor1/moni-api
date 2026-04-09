import { prisma } from '../database/prisma.js'
import { Prisma } from '@prisma/client'
import type { IUsersRepository } from './interfaces/IUsersRepository.js'

export class UsersRepository implements IUsersRepository {
  async create(data: Prisma.usersCreateInput) {
    const user = await prisma.users.create({ data })
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.users.findUnique({ where: { email } })
    return user
  }
}