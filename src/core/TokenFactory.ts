import uuid from "uuid/v4";
import AccessTokenRepository from "../repository/AccessTokenRepository";
import RefreshTokenRepository from "../repository/RefreshTokenRepository";

class TokenFactory {
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

export default TokenFactory;