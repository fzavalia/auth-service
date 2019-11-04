import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AccountRepository from "../../repository/AccountRepository/AccountRepository";
import AccessTokenRepository from "../../repository/AccessTokenRepository/AccessTokenRepository";
import RefreshTokenRepository from "../../repository/RefreshTokenRepository/RefreshTokenRepository";

class Login {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly tokenFactory: TokenFactory
  ) {}

  exec = async (username: string, password: string) => {
    const account = await this.accountRepository.find(username);
    await this.validatePassword(password, account.password);
    return await this.tokenFactory.makeTokens(account.username);
  };

  private validatePassword = async (
    inputPassword: string,
    accountPassword: string
  ) => {
    const match = await bcrypt.compare(inputPassword, accountPassword);
    if (!match) {
      throw new Error();
    }
  };
}

class TokenFactory {
  constructor(
    private readonly atRepository: AccessTokenRepository,
    private readonly rtRepository: RefreshTokenRepository
  ) {}

  makeTokens = async (accountUsername: string) => {
    const at = await this.makeAccessToken(accountUsername);
    const rt = await this.makeRefreshToken(accountUsername, at);
    return { accessToken: at, refreshToken: rt };
  };

  makeAccessToken = async (accountUsername: string) => {
    await this.atRepository.invalidateAllForAccount(accountUsername);
    const at = jwt.sign("foo", "secret");
    await this.atRepository.create({
      value: at,
      valid: true,
      accountUsername: accountUsername
    });
    return at;
  };

  makeRefreshToken = async (accountUsername: string, accessToken: string) => {
    await this.rtRepository.invalidateAllForAccount(accountUsername);
    const rt = jwt.sign("foo", "secret");
    await this.rtRepository.create({
      value: rt,
      valid: true,
      accountUsername: accountUsername,
      accessTokenValue: accessToken
    });
    return rt;
  };
}

export default Login;
