import RefreshTokenRepository, { RefreshToken } from "../repository/RefreshTokenRepository";
import TokenFactory from "../core/TokenFactory";
import { isBefore } from "date-fns";

class Refresh {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenFactory: TokenFactory,
  ) {}

  exec = async (accessTokenValue: string, refreshTokenValue: string) => {
    const refreshToken = await this.refreshTokenRepository.find(refreshTokenValue);
    this.validateRefreshToken(refreshToken, accessTokenValue);
    return await this.tokenFactory.makeTokens(refreshToken.accountUsername);
  };

  private validateRefreshToken = (refreshToken: RefreshToken, accessTokenValue: string) => {
    const isExpired = isBefore(refreshToken.expiration, new Date());
    const isInvalidated = !refreshToken.valid;
    const isNotForAccessToken = refreshToken.accessTokenValue !== accessTokenValue;
    if (isExpired || isInvalidated || isNotForAccessToken) {
      throw new InvalidToken();
    }
  };
}

export class InvalidToken extends Error {
  name = "InvalidToken";
  message = "The provided token is invalid";
}

export default Refresh;
