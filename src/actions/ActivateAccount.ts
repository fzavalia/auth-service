import ActivationSecretRepository, { ActivationSecret } from "../repository/ActivationSecretRepository";
import AccountRepository, { Account } from "../repository/AccountRepository";
import { isBefore } from "date-fns";
import CustomError from "../core/CustomError";

class ActivateAccount {
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
    if (isBefore(activationSecret.expiration, new Date())) {
      throw new ExpiredActivationSecret();
    }
    if (activationSecret.used) {
      throw new UsedActivationSecret();
    }
  };

  private validateAccount = (account: Account) => {
    if (account.active) {
      throw new AccountAlreadyActive();
    }
  };
}

export class ExpiredActivationSecret extends CustomError {
  name = "ExpiredActivationSecret";
}

export class UsedActivationSecret extends CustomError {
  name = "UsedActivationSecret";
}

export class AccountAlreadyActive extends CustomError {
  name = "AccountAlreadyActive";
}

export default ActivateAccount;
