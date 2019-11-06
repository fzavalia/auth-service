import bcrypt from "bcrypt";
import AccountRepository from "../repository/AccountRepository";
import uuid from "uuid/v4";
import ActivationSecretRepository from "../repository/ActivationSecretRepository";
import { addDays } from "date-fns";

class Register {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly activationSecretRepository: ActivationSecretRepository,
  ) {}

  exec: (username: string, password: string, passwordConfirmation: string) => Promise<string> = async (
    username,
    password,
    passwordConfirmation,
  ) => {
    await this.validatePasswords(password, passwordConfirmation);
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.accountRepository.create({ username, password: hashedPassword, active: false });
    const activationSecret = uuid();
    await this.activationSecretRepository.create({
      accountUsername: username,
      value: activationSecret,
      used: false,
      expiration: addDays(new Date(), 1),
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

class PasswordsDoNotMatch extends Error {
  name = "PasswordsDoNotMatch";
  message = "The password and passwordConfirmation fields are not the same";
}

export default Register;
