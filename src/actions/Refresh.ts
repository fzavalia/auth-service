import RefreshTokenRepository, { RefreshToken } from "../repository/RefreshTokenRepository";
import TokenFactory from "../core/TokenFactory";
import { isBefore } from "date-fns";
import CustomError from "../core/CustomError";

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
    if (isBefore(refreshToken.expiration, new Date())) {
      throw new ExpiredRefreshToken();
    }
    if (!refreshToken.valid) {
      throw new InvalidRefreshToken();
    }
    if (refreshToken.accessTokenValue !== accessTokenValue) {
      throw new RefreshTokenAndAccessTokenMismatch();
    }
  };
}

export class ExpiredRefreshToken extends CustomError {
  name = "ExpiredRefreshToken";
}

export class InvalidRefreshToken extends CustomError {
  name = "InvalidRefreshToken";
}

export class RefreshTokenAndAccessTokenMismatch extends CustomError {
  name = "RefreshTokenAndAccessTokenMismatch";
}

export default Refresh;
