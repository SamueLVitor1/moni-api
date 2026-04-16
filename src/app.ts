import fastify from 'fastify'
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user.routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'
import { authRoutes } from './routes/auth.routes.js'
import { errorHandler } from './error-handler.js'
import { bankAccountRoutes } from './routes/bank-account.routes.js'

export const app = fastify({ logger: true })

app.setErrorHandler(errorHandler)

app.register(cors, { origin: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.decorate('authenticate', async (request: any, _reply: any) => {
  await request.jwtVerify()
})

app.register(userRoutes)
app.register(authRoutes)
app.register(bankAccountRoutes)