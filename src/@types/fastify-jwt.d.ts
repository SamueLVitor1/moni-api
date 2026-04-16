import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
    } 
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any 
  }
}