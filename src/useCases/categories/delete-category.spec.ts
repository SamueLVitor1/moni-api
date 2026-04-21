import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-categories.repository.js'
import { DeleteCategoryUseCase } from './delete-category.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

let categoriesRepository: InMemoryCategoriesRepository
let sut: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new DeleteCategoryUseCase(categoriesRepository)
  })

  it('deve conseguir deletar uma categoria', async () => {
    const created = await categoriesRepository.create({
      user_id: 'user-id-01',
      name: 'Alimentação',
    })

    await sut.execute({ id: created.id, userId: 'user-id-01' })

    expect(categoriesRepository.items).toHaveLength(0)
  })

  it('não deve conseguir deletar uma categoria inexistente', async () => {
    await expect(() =>
      sut.execute({ id: 'id-inexistente', userId: 'user-id-01' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('não deve conseguir deletar uma categoria que pertence a outro usuário', async () => {
    const created = await categoriesRepository.create({
      user_id: 'user-id-01',
      name: 'Alimentação',
    })

    await expect(() =>
      sut.execute({ id: created.id, userId: 'user-id-02' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(categoriesRepository.items).toHaveLength(1)
  })
})
