import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-categories.repository.js'
import { FetchUserCategoriesUseCase } from './fetch-user-categories.js'

let categoriesRepository: InMemoryCategoriesRepository
let sut: FetchUserCategoriesUseCase

describe('Fetch User Categories Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new FetchUserCategoriesUseCase(categoriesRepository)
  })

  it('deve ser capaz de listar as categorias de um usuário específico', async () => {
    await categoriesRepository.create({ user_id: 'user-id-01', name: 'Alimentação' })
    await categoriesRepository.create({ user_id: 'user-id-01', name: 'Transporte' })

    const { categories } = await sut.execute({ userId: 'user-id-01' })

    expect(categories).toHaveLength(2)
    expect(categories).toEqual([
      expect.objectContaining({ user_id: 'user-id-01', name: 'Alimentação' }),
      expect.objectContaining({ user_id: 'user-id-01', name: 'Transporte' }),
    ])
  })

  it('não deve listar categorias que pertencem a outro userId', async () => {
    await categoriesRepository.create({ user_id: 'user-id-01', name: 'Alimentação' })
    await categoriesRepository.create({ user_id: 'user-id-02', name: 'Lazer' })

    const { categories } = await sut.execute({ userId: 'user-id-01' })

    expect(categories).toHaveLength(1)
    expect(categories[0]).toEqual(expect.objectContaining({ user_id: 'user-id-01' }))
  })
})
