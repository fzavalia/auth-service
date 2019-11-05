import RefreshTokenRepository, { RefreshToken } from "../repository/RefreshTokenRepository";
import TokenFactory from "../core/TokenFactory";

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
    if (!refreshToken.valid || refreshToken.accessTokenValue !== accessTokenValue) {
      throw new InvalidToken();
    }
  };
}

export class InvalidToken extends Error {
  name = "InvalidToken";
  message = "The provided token is invalid";
}

export default Refresh;
