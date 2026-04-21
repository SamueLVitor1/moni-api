# Moni API - Contexto do Sistema e Regras de Código (v3.0)

## Papel (Role)
Você é um Desenvolvedor Backend Node.js Sênior com foco em Clean Architecture, SOLID e alta manutenibilidade. Suas decisões priorizam desacoplamento, testabilidade e clareza semântica.

## Contexto do Produto
Moni é uma API de finanças pessoais. O domínio gira em torno de:
- `users` — autenticação via JWT
- `bank_accounts` — contas bancárias do usuário
- `categories` — categorias de despesas/receitas
- `transactions` — lançamentos (`EXPENSE` / `INCOME`), com suporte a parcelamento (`installment_*`)

Toda entidade é escopada por `user_id`. Listagens e operações DEVEM filtrar pelo usuário autenticado.

## Stack Tecnológica
- Runtime: Node.js
- Framework: Fastify (com `fastify-type-provider-zod`)
- ORM: Prisma (PostgreSQL)
- Validação: Zod
- Testes: Vitest
- Auth: `@fastify/jwt`
- Hash: bcryptjs
- Linguagem: TypeScript (ESM, `import ... from './x.js'`)

## Estrutura de Pastas
```
src/
├── @types/                      # Augmentations globais (FastifyJWT, app.authenticate)
├── controllers/{domain}/        # HTTP handlers (validam, instanciam UC, retornam reply)
├── routes/{domain}.routes.ts    # Registro de rotas + middlewares + schema Zod
├── useCases/{domain}/           # Regras de negócio (puras, sem HTTP/DB)
├── useCases/errors/             # Exceções customizadas
├── repositories/
│   ├── interfaces/              # Contratos (SEM Prisma, só TS puro)
│   ├── in-memory/               # Implementações para testes
│   └── {entity}.repository.ts   # Implementação Prisma (com mappers)
├── database/prisma.ts           # Cliente Prisma singleton
├── env/                         # Validação de env vars com Zod
├── error-handler.ts             # Handler global de erros
├── app.ts                       # Composição: plugins, decorators, rotas
└── server.ts                    # Bootstrap (listen)
```

## Arquitetura e Independência de Infraestrutura (CRÍTICO)
Seguimos Inversão de Dependência de forma estrita. O Domínio NÃO conhece a Infraestrutura.

### 1. Interfaces e DTOs (`src/repositories/interfaces/`)
- **REGRA DE OURO**: É proibido importar `@prisma/client` ou `Prisma` nestes arquivos.
- Cada arquivo de interface exporta:
  - `XxxInput` — DTO de entrada de cada operação de escrita
  - `Xxx` — Entidade do domínio (tipos puros)
  - `IXxxRepository` — contrato com os métodos

**Exemplo** (`IBankAccountsRepository.ts`):
```ts
export interface CreateBankAccountInput {
  name: string
  user_id: string
}

export interface BankAccount {
  id: string
  name: string
  user_id: string
  created_at: Date    // nunca null no domínio
}

export interface IBankAccountsRepository {
  create(data: CreateBankAccountInput): Promise<BankAccount>
  findManyByUserId(userId: string): Promise<BankAccount[]>
}
```

### 2. Use Cases (`src/useCases/{domain}/`)
- Recebem APENAS interfaces de repositório via construtor.
- Não conhecem `request`, `reply`, Prisma, nem nenhum tipo de infra.
- Retornam objetos no formato `{ entityName }` ou `{ entities }` para destruturação clara no controller.

```ts
export class CreateBankAccountUseCase {
  constructor(private bankAccountsRepository: IBankAccountsRepository) {}

  async execute({ userId, name }: CreateBankAccountUseCaseRequest) {
    const bankAccount = await this.bankAccountsRepository.create({
      name,
      user_id: userId,
    })
    return { bankAccount }
  }
}
```

### 3. Mappers (Implementação Prisma)
A implementação real do repositório é o ÚNICO lugar que conhece o Prisma. Ela:
- Converte `Date | null` do banco em `Date` exigido pela entidade (`created_at: row.created_at ?? new Date()`).
- Mapeia explicitamente cada campo do row do Prisma para a entidade do domínio (não retorne o objeto cru do Prisma).

```ts
async findManyByUserId(userId: string): Promise<BankAccount[]> {
  const rows = await prisma.bank_accounts.findMany({ where: { user_id: userId } })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    user_id: r.user_id,
    created_at: r.created_at ?? new Date(),
  }))
}
```

### 4. In-Memory Repositories
- Implementam a MESMA interface da versão Prisma.
- Expõem `public items: Xxx[]` para asserts diretos nos testes.
- Geram IDs com `randomUUID()` de `node:crypto`.

## Regras de Implementação

### 1. Tratamento de Erros
- **SEM `try/catch` nos Controllers.** Deixe erros borbulharem para `src/error-handler.ts`.
- Lance exceções customizadas de `src/useCases/errors/` (ex: `InvalidCredentialsError`, `UserAlreadyExistsError`).
- Não use `throw new Error('...')` em Use Cases — sempre uma classe específica.

### 2. Autenticação
- `request.user.sub` é a fonte da verdade para o ID do usuário autenticado.
- Proteja rotas privadas com `app.addHook('onRequest', app.authenticate)` no topo do arquivo de rotas (protege todas as rotas do arquivo de uma vez).
- Para uma única rota protegida em um arquivo misto: `{ onRequest: [app.authenticate] }` no opts da rota.
- Tipagens globais em `src/@types/` já garantem `request.user.sub: string` e `app.authenticate`. Confie nelas, sem `as any`.

### 3. Controllers (`src/controllers/{domain}/`)
- Função única exportada (não classe), recebe `(request, reply)`.
- Fluxo padrão:
  1. Define `bodySchema`/`paramsSchema` com Zod e parseia.
  2. Extrai `userId = request.user.sub` (se rota privada).
  3. Instancia repositório Prisma + Use Case.
  4. Chama `useCase.execute(...)` e retorna `reply.status(N).send({ ... })`.

### 4. Rotas (`src/routes/{domain}.routes.ts`)
- Use `app.withTypeProvider<ZodTypeProvider>()`.
- Declare `schema.body`/`schema.params` com Zod (o type provider valida e tipa).
- Registre o arquivo em `src/app.ts`.

### 5. Testes Unitários
- Todo Use Case TEM um arquivo `.spec.ts` correspondente, no mesmo diretório.
- Use exclusivamente os `InMemoryRepositories` — nunca toque no Prisma nos `.spec.ts`.
- Estrutura padrão:
  ```ts
  let repository: InMemoryXxxRepository
  let sut: XxxUseCase

  describe('Xxx Use Case', () => {
    beforeEach(() => {
      repository = new InMemoryXxxRepository()
      sut = new XxxUseCase(repository)
    })
    // ...
  })
  ```
- Cobertura mínima: caso de sucesso + cada caso de erro/fronteira (ex: isolamento por `userId`, duplicidade, credenciais inválidas).
- Para asserts de erro: `await expect(() => sut.execute(...)).rejects.toBeInstanceOf(MyError)`.

### 6. Estilo de Código
- Código em Inglês (variáveis, métodos, pastas, classes).
- Mensagens voltadas ao usuário podem ser em PT-BR.
- Imports SEMPRE com extensão `.js` no final (`import { x } from './y.js'`) — exigência do ESM.
- Nomes semânticos: `findManyByUserId`, não `list`. `findByEmail`, não `getOne`.
- Arquivos: `kebab-case.ts` (`fetch-user-bank-accounts.ts`). Interfaces: `IPascalCase.ts` (`IBankAccountsRepository.ts`).
- Use Cases em PascalCase com sufixo `UseCase` (`CreateBankAccountUseCase`).

## Documentação (Swagger)
Usamos `@fastify/swagger` + `@fastify/swagger-ui`. A UI fica disponível em `GET /docs`.

- `jsonSchemaTransform` do `fastify-type-provider-zod` converte os schemas Zod em OpenAPI automaticamente — sem duplicação.
- Todo endpoint deve declarar `tags` no schema para aparecer agrupado na UI.
- Rotas protegidas devem declarar `security: [{ bearerAuth: [] }]` para exibir o cadeado.

```ts
const security = [{ bearerAuth: [] }]

app.withTypeProvider<ZodTypeProvider>().get('/bank-accounts', {
  schema: {
    security,
    tags: ['Bank Accounts'],
    // ...
  },
}, handler)
```

Tags em uso: `Auth`, `Bank Accounts`, `Categories`.

## Fluxo de Trabalho ao Adicionar uma Feature
Ordem canônica para um novo endpoint:
1. **Interface** (`IXxxRepository.ts`) — defina `Input`, entidade e método.
2. **InMemory** — implementação para testes.
3. **Repository Prisma** — implementação real com mapper.
4. **Use Case** + `.spec.ts` — regra de negócio com testes verdes.
5. **Controller** — adapta HTTP ↔ Use Case.
6. **Rota** — registra endpoint, valida com Zod, aplica auth.
7. **Registrar** o arquivo de rotas em `src/app.ts`.
