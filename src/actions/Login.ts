import AccountRepository, { Account } from "../repository/AccountRepository";
import AccessTokenRepository from "../repository/AccessTokenRepository";
import RefreshTokenRepository from "../repository/RefreshTokenRepository";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

interface Login {
  exec: (username: string, password: string) => Promise<LoginResult>;
}

export class LoginImpl implements Login {
  private readonly secret = "my-secret";

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly salt: Salt,
    private readonly tokenFactory: TokenFactory
  ) {}

  exec = async (username: string, password: string) => {
    const account = await this.accountRepository.find(username);
    await this.salt.validate(password, account.password);
    const accessToken = await this.makeAccessToken(account);
    const refreshToken = await this.makeRefreshToken(account, accessToken);
    return { accessToken, refreshToken };
  };

  private readonly makeAccessToken = async (account: Account) => {
    await this.accessTokenRepository.invalidateAllForAccount(account.username);
    const accessToken = await this.tokenFactory.makeAccessToken();
    await this.accessTokenRepository.create({
      value: accessToken,
      valid: true,
      accountUsername: account.username
    });
    return accessToken;
  };

  private readonly makeRefreshToken = async (
    account: Account,
    accessToken: string
  ) => {
    await this.refreshTokenRepository.invalidateAllForAccount(account.username);
    const refreshToken = await this.tokenFactory.makeRefreshToken();
    await this.refreshTokenRepository.create({
      value: accessToken,
      valid: true,
      accountUsername: account.username,
      accessTokenValue: accessToken
    });
    return refreshToken;
  };
}

interface Salt {
  validate: (data: string, hash: string) => Promise<void>;
}

interface TokenFactory {
  makeAccessToken: () => Promise<string>;
  makeRefreshToken: () => Promise<string>;
}

export default Login;
