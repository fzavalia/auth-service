import bcrypt from "bcrypt";
import uuid from "uuid/v4";
import AccountRepository, { Account } from "../repository/AccountRepository";
import AccessTokenRepository from "../repository/AccessTokenRepository";
import RefreshTokenRepository from "../repository/RefreshTokenRepository";

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
    if (bcrypt.compareSync(inputPassword, accountPassword)) {
      throw new LoginFailed();
    }
  };
}

class LoginFailed extends Error {
  name = "LoginFailed";
  message = "Could not login due to invalid username or password";
}

export class TokenFactory {
  constructor(
    private readonly atRepository: AccessTokenRepository,
    private readonly rtRepository: RefreshTokenRepository,
  ) {}

  makeTokens = async (accountUsername: string) => {
    const at = await this.makeAccessToken(accountUsername);
    const rt = await this.makeRefreshToken(accountUsername, at);
    return { accessToken: at, refreshToken: rt };
  };

  makeAccessToken = async (accountUsername: string) => {
    await this.atRepository.invalidateAllForAccount(accountUsername);
    const at = uuid();
    await this.atRepository.create({
      value: at,
      valid: true,
      accountUsername: accountUsername,
    });
    return at;
  };

  makeRefreshToken = async (accountUsername: string, accessToken: string) => {
    await this.rtRepository.invalidateAllForAccount(accountUsername);
    const rt = uuid();
    await this.rtRepository.create({
      value: rt,
      valid: true,
      accountUsername: accountUsername,
      accessTokenValue: accessToken,
    });
    return rt;
  };
}

export default Login;
