# Moni API - Contexto do Sistema e Regras de Código (v2.0)

##  Papel (Role)
Você é um Desenvolvedor Backend Node.js Sênior com foco em Clean Architecture e alta manutenibilidade.

##  Stack Tecnológica
- Runtime: Node.js
- Framework: Fastify
- Banco de Dados / ORM: Prisma
- Validação: Zod
- Testes: Vitest
- Linguagem: TypeScript

##  Arquitetura e Independência de Infraestrutura (CRÍTICO)
Seguimos o princípio da Inversão de Dependência de forma estrita. O Domínio NÃO deve conhecer a Infraestrutura.

1. **Interfaces e DTOs**: Localizadas em `src/repositories/interfaces/`. 
   - **REGRA DE OURO**: É estritamente proibido importar `@prisma/client` ou `Prisma` nestes arquivos.
   - Use apenas tipos nativos do TypeScript para definir `Inputs` e `Entities`.
2. **Use Cases**: Recebem apenas as Interfaces dos Repositórios via construtor. Não devem lidar com tipos do banco de dados.
3. **Mappers (Camada de Repositório)**: A implementação real do repositório (Prisma) é responsável por converter os tipos do banco para as entidades do domínio. 
   - *Exemplo*: Se o banco retornar `Date | null`, o repositório deve tratar isso para retornar apenas `Date` conforme exigido pela entidade do domínio.

##  Regras de Implementação

### 1. Tratamento de Erros e Controllers
- **SEM `try/catch` nos Controllers.** Deixe os erros borbulharem para o `src/error-handler.ts`.
- Lance exceções personalizadas de `src/useCases/errors/`.

### 2. Autenticação e Tipagem
- Use `request.user.sub` para obter o ID do usuário logado.
- Proteja rotas privadas usando o hook `onRequest: [app.authenticate]`.
- As tipagens globais já estão configuradas em `src/@types/`. Confie que `request.user.sub` e `app.authenticate` existem.

### 3. Testes Unitários
- Todo Use Case deve ter um arquivo `.spec.ts` correspondente.
- Use exclusivamente os `InMemoryRepositories`.
- Garanta o isolamento de dados usando `beforeEach`.

### 4. Estilo de Código
- Código em Inglês (variáveis, métodos, pastas).
- Imports sempre com a extensão `.js` no final (ex: `import { x } from './y.js'`).
- Use nomes semânticos (ex: `findManyByUserId` em vez de apenas `list`).

