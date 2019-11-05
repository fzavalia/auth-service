import bcrypt from "bcrypt";
import AccountRepository, { Account } from "../repository/AccountRepository";
import TokenFactory from "../core/TokenFactory";

class Login {
  constructor(private readonly accountRepository: AccountRepository, private readonly tokenFactory: TokenFactory) {}

  exec = async (username: string, password: string) => {
    const account = await this.accountRepository.find(username);
    this.validateAccount(account);
    this.validatePassword(password, account.password);
    return await this.tokenFactory.makeTokens(account.username);
  };

  private validateAccount = (account: Account) => {
    if (!account.active) {
      throw new LoginFailed();
    }
  };

  private validatePassword = (inputPassword: string, accountPassword: string) => {
    if (!bcrypt.compareSync(inputPassword, accountPassword)) {
      throw new LoginFailed();
    }
  };
}

class LoginFailed extends Error {
  name = "LoginFailed";
  message = "Could not login due to invalid username or password";
}

export default Login;
