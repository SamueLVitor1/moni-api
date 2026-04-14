import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users.repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js' 


let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // O beforeEach roda ANTES de cada it
  //  garante que cada teste comece com um banco de dados limpo e vazio
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('deve conseguir autenticar um usuário válido', async () => {
    await usersRepository.create({
      name: 'Teste Silva',
      email: 'teste@moni.com',
      password_hash: await hash('123456', 6), 
    })


    const { user } = await sut.execute({
      email: 'teste@moni.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('não deve conseguir autenticar com e-mail incorreto', async () => {
    await expect(() =>
      sut.execute({
        email: 'email_falso@moni.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('não deve conseguir autenticar com senha incorreta', async () => {
    await usersRepository.create({
      name: 'Teste Silva',
      email: 'teste@moni.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'teste@moni.com',
        password: 'senha_errada',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})