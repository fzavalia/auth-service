import bcrypt from "bcrypt";
import AccountRepository from "../repository/AccountRepository";
import uuid from "uuid/v4";
import ActivationSecretRepository from "../repository/ActivationSecretRepository";
import { addMinutes } from "date-fns";
import CustomError from "../core/CustomError";
import PasswordResolver from "../core/PasswordResolver";

class Register {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly activationSecretRepository: ActivationSecretRepository,
    private readonly passwordResolver: PasswordResolver,
    private readonly activationSecretExpiration: number,
  ) {}

  exec: (username: string, password: string, passwordConfirmation: string) => Promise<string> = async (
    username,
    password,
    passwordConfirmation,
  ) => {
    await this.validatePasswords(password, passwordConfirmation);
    const hashedPassword = this.passwordResolver.encrypt(password);
    await this.accountRepository.create({ username, password: hashedPassword, active: false });
    const activationSecret = uuid();
    await this.activationSecretRepository.create({
      accountUsername: username,
      value: activationSecret,
      used: false,
      expiration: addMinutes(new Date(), this.activationSecretExpiration),
    });
    return activationSecret;
  };

  private validatePasswords = (password: string, passwordConfirmation: string) =>
    new Promise<void>((resolve, reject) => {
      if (password !== passwordConfirmation) {
        reject(new PasswordsDoNotMatch());
      } else {
        resolve();
      }
    });
}

export class PasswordsDoNotMatch extends CustomError {
  name = "PasswordsDoNotMatch";
}

export default Register;
