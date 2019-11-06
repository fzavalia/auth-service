import ActivationSecretRepository, { ActivationSecret } from "../repository/ActivationSecretRepository";
import AccountRepository, { Account } from "../repository/AccountRepository";
import { isBefore } from "date-fns";

class Activate {
  constructor(
    private readonly activationSecretRepository: ActivationSecretRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  exec: (activationSecretValue: string) => Promise<void> = async activationSecretValue => {
    const activationSecret = await this.activationSecretRepository.find(activationSecretValue);
    this.validateActivationSecret(activationSecret);
    const account = await this.accountRepository.find(activationSecret.accountUsername);
    this.validateAccount(account);
    await this.activationSecretRepository.use(activationSecretValue);
    await this.accountRepository.activate(activationSecret.accountUsername);
  };

  private validateActivationSecret = (activationSecret: ActivationSecret) => {
    const isExpired = isBefore(activationSecret.expiration, new Date());
    const isUsed = activationSecret.used;
    if (isExpired || isUsed) {
      throw new InvalidActivationSecret();
    }
  };

  private validateAccount = (account: Account) => {
    if (account.active) {
      throw new InvalidActivationSecret();
    }
  };
}

class InvalidActivationSecret extends Error {
  name = "InvalidActivationSecret";
  message =
    "The secret is invalid, it might have been used already, it might not exist or the account linked to it might have already been activated";
}

export default Activate;
