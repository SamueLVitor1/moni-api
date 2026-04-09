import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users.repository.js'
import { CreateUserUseCase } from './create-user.js'

describe('Create User Use Case', () => {
  it('deve conseguir criar um novo usuário', async () => {
  
    const usersRepository = new InMemoryUsersRepository()
 
    const sut = new CreateUserUseCase(usersRepository) 

   
    const { user } = await sut.execute({
      name: 'Samuel Teste',
      email: 'samuel@teste.com',
      password: '123456',
    })


    expect(user.id).toEqual(expect.any(String))
  })

  it('não deve conseguir criar um usuário com e-mail duplicado', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new CreateUserUseCase(usersRepository)

    const email = 'samuel@teste.com'


    await sut.execute({ name: 'Samuel 1', email, password: '123' })


    await expect(() =>
      sut.execute({ name: 'Samuel 2', email, password: '123' })
    ).rejects.toBeInstanceOf(Error)
  })
})