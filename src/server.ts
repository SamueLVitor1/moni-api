import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: true // Isso aqui ajuda muito no debug!
});

async function bootstrap() {
  // Configurando o CORS
  await fastify.register(cors, {
    origin: true,
  });

  // Rota de teste
  fastify.get('/', async () => {
    return { message: "Moni API is running with Fastify! 💸" };
  });

  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Server started on http://localhost:3333');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();