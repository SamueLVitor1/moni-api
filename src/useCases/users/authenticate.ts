import { compare } from "bcryptjs";
import type { IUsersRepository } from "../../repositories/interfaces/IUsersRepository.js";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.js";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest) {
    // Busca usuária(o) pelo e-mail
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, user.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
