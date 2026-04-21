import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user.routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'
import { authRoutes } from './routes/auth.routes.js'
import { errorHandler } from './error-handler.js'
import { bankAccountRoutes } from './routes/bank-account.routes.js'
import { categoryRoutes } from './routes/category.routes.js'

export const app = fastify({ logger: true })

app.setErrorHandler(errorHandler)

app.register(cors, { origin: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swagger, {
  openapi: {
    info: {
      title: 'Moni API',
      description: 'API de finanças pessoais',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(swaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.decorate('authenticate', async (request: any, _reply: any) => {
  await request.jwtVerify()
})

app.register(userRoutes)
app.register(authRoutes)
app.register(bankAccountRoutes)
app.register(categoryRoutes)