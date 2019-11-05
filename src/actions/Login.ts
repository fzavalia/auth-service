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
    if (!bcrypt.compareSync(inputPassword, accountPassword)) {
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
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  makeTokens = async (accountUsername: string) => {
    const accessToken = await this.makeAccessToken(accountUsername);
    const refreshToken = await this.makeRefreshToken(accountUsername, accessToken);
    return { accessToken: accessToken, refreshToken: refreshToken };
  };

  makeAccessToken = async (accountUsername: string) => {
    await this.accessTokenRepository.invalidateAllForAccount(accountUsername);
    const accessToken = uuid();
    await this.accessTokenRepository.create({
      value: accessToken,
      valid: true,
      accountUsername: accountUsername,
    });
    return accessToken;
  };

  makeRefreshToken = async (accountUsername: string, accessToken: string) => {
    await this.refreshTokenRepository.invalidateAllForAccount(accountUsername);
    const refreshToken = uuid();
    await this.refreshTokenRepository.create({
      value: refreshToken,
      valid: true,
      accountUsername: accountUsername,
      accessTokenValue: accessToken,
    });
    return refreshToken;
  };
}

export default Login;
