// src/use_cases/Login.ts

import { generateToken } from '../../utils/tokenUtils';
import { IUserRepository } from '../../repositories/UserRepository';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    //verify the user and generate a JWT token.
    const user = await this.userRepository.findByEmail(email);
    if (!user || !this.userRepository.isValidPassword(password, user.password)) {
      throw new Error('Invalid username or password.');
    }
    return generateToken(user);
  }
}


