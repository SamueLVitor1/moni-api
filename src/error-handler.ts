import type { FastifyInstance, FastifyError } from "fastify";
import { ZodError } from "zod";
import { InvalidCredentialsError } from "./useCases/errors/invalid-credentials-error.js";
import { UserAlreadyExistsError } from "./useCases/errors/user-already-exists-error.js";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // erro do Zod (Validação)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação.",
      issues: error.format(), 
    });
  }

  //erro de Login Inválido
  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: error.message });
  }

  // erro de E-mail Duplicado
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  const fastifyError = error as FastifyError;

  if (
    fastifyError.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
    fastifyError.code === "FST_JWT_BAD_REQUEST"
  ) {
    return reply
      .status(401)
      .send({ message: "Token de autenticação não encontrado ou inválido." });
  }

  if (fastifyError.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
    return reply
      .status(401)
      .send({ message: "Sua sessão expirou. Faça login novamente." });
  }
  // erro bizarro que não mapeamos (ex: Banco de Dados caiu)
  console.error(error);
  return reply.status(500).send({ message: "Erro interno do servidor." });
};
