import AccessTokenRepository, { AccessToken } from "../repository/AccessTokenRepository";
import { isBefore } from "date-fns";
import CustomError from "../core/CustomError";

class Authenticate {
  constructor(private readonly accessTokenRepository: AccessTokenRepository) {}

  exec: (accessTokenValue: string) => Promise<void> = async accessTokenValue => {
    const accessToken = await this.accessTokenRepository.find(accessTokenValue);
    this.validateAccessToken(accessToken);
  };

  private validateAccessToken = (accessToken: AccessToken) => {
    if (isBefore(accessToken.expiration, new Date())) {
      throw new ExpiredAccessToken();
    }
    if (!accessToken.valid) {
      throw new InvalidAccessToken();
    }
  };
}

export class ExpiredAccessToken extends CustomError {
  name = "ExpiredAccessToken";
}

export class InvalidAccessToken extends CustomError {
  name = "InvalidAccessToken";
}

export default Authenticate;
