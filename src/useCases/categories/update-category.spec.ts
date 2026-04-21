import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-categories.repository.js'
import { UpdateCategoryUseCase } from './update-category.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

let categoriesRepository: InMemoryCategoriesRepository
let sut: UpdateCategoryUseCase

describe('Update Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new UpdateCategoryUseCase(categoriesRepository)
  })

  it('deve conseguir atualizar o nome de uma categoria', async () => {
    const created = await categoriesRepository.create({
      user_id: 'user-id-01',
      name: 'Alimentação',
    })

    const { category } = await sut.execute({
      id: created.id,
      userId: 'user-id-01',
      name: 'Alimentação Atualizado',
    })

    expect(category.name).toEqual('Alimentação Atualizado')
    expect(category.id).toEqual(created.id)
  })

  it('não deve conseguir atualizar uma categoria inexistente', async () => {
    await expect(() =>
      sut.execute({ id: 'id-inexistente', userId: 'user-id-01', name: 'Teste' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('não deve conseguir atualizar uma categoria que pertence a outro usuário', async () => {
    const created = await categoriesRepository.create({
      user_id: 'user-id-01',
      name: 'Alimentação',
    })

    await expect(() =>
      sut.execute({ id: created.id, userId: 'user-id-02', name: 'Tentativa' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
