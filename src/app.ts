import fastify from 'fastify'
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user.routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'
import { authRoutes } from './routes/auth.routes.js'

export const app = fastify({ logger: true })

app.register(cors, { origin: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(authRoutes)