import AccessTokenRepository, { AccessToken } from "../repository/AccessTokenRepository";
import { InvalidToken } from "./Refresh";
import { isBefore } from "date-fns";

class Authenticate {
  constructor(private readonly accessTokenRepository: AccessTokenRepository) {}

  exec: (accessTokenValue: string) => Promise<void> = async accessTokenValue => {
    const accessToken = await this.accessTokenRepository.find(accessTokenValue);
    this.validateAccessToken(accessToken);
  };

  private validateAccessToken = (accessToken: AccessToken) => {
    const isExpired = isBefore(accessToken.expiration, new Date());
    const isInvalidated = !accessToken.valid;
    if (isExpired || isInvalidated) {
      throw new InvalidToken();
    }
  };
}

export default Authenticate;
