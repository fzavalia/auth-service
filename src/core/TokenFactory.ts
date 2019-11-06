import uuid from "uuid/v4";
import AccessTokenRepository from "../repository/AccessTokenRepository";
import RefreshTokenRepository from "../repository/RefreshTokenRepository";
import { addMinutes } from "date-fns";

class TokenFactory {
  constructor(
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly accessTokenExpiration: number,
    private readonly refreshTokenExpiration: number,
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
      expiration: addMinutes(new Date(), this.accessTokenExpiration),
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
      expiration: addMinutes(new Date(), this.refreshTokenExpiration),
    });
    return refreshToken;
  };
}

export default TokenFactory;
