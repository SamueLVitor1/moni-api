import type { Prisma, users } from '@prisma/client'

export interface IUsersRepository {
  create(data: Prisma.usersCreateInput): Promise<users>
  findByEmail(email: string): Promise<users | null>
}