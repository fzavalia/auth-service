import AccountRepository, { Account } from "../repository/AccountRepository";
import TokenFactory from "../core/TokenFactory";
import CustomError from "../core/CustomError";
import PasswordResolver from "../core/PasswordResolver";

class Login {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly tokenFactory: TokenFactory,
    private readonly passwordResolver: PasswordResolver,
  ) {}

  exec = async (username: string, password: string) => {
    const account = await this.accountRepository.find(username);
    this.validateAccount(account);
    this.validatePassword(password, account.password);
    return await this.tokenFactory.makeTokens(account.username);
  };

  private validateAccount = (account: Account) => {
    if (!account.active) {
      throw new InactiveAccount();
    }
  };

  private validatePassword = (inputPassword: string, accountPassword: string) => {
    if (!this.passwordResolver.compare(inputPassword, accountPassword)) {
      throw new InvalidPassword();
    }
  };
}

export class InactiveAccount extends CustomError {}

export class InvalidPassword extends CustomError {}

export default Login;
