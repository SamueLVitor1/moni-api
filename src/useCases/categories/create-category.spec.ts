import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-categories.repository.js'
import { CreateCategoryUseCase } from './create-category.js'

let categoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(categoriesRepository)
  })

  it('deve conseguir criar uma nova categoria', async () => {
    const { category } = await sut.execute({
      userId: 'user-id-01',
      name: 'Alimentação',
    })

    expect(category.id).toEqual(expect.any(String))
    expect(category.name).toEqual('Alimentação')
    expect(category.user_id).toEqual('user-id-01')
  })

  it('deve persistir a categoria no repositório', async () => {
    await sut.execute({ userId: 'user-id-01', name: 'Transporte' })

    expect(categoriesRepository.items).toHaveLength(1)
    expect(categoriesRepository.items[0]?.name).toEqual('Transporte')
  })

  it('deve permitir que um mesmo usuário crie múltiplas categorias', async () => {
    await sut.execute({ userId: 'user-id-01', name: 'Alimentação' })
    await sut.execute({ userId: 'user-id-01', name: 'Transporte' })

    expect(categoriesRepository.items).toHaveLength(2)
  })
})
