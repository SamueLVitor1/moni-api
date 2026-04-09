import fastify from 'fastify'
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user.routes.js'

export const app = fastify({ logger: true })

app.register(cors, { origin: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


app.register(userRoutes)