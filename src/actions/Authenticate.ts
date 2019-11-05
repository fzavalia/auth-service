import AccessTokenRepository, { AccessToken } from "../repository/AccessTokenRepository";
import { InvalidToken } from "./Refresh";

class Authenticate {
  constructor(private readonly accessTokenRepository: AccessTokenRepository) {}

  exec: (accessTokenValue: string) => Promise<void> = async accessTokenValue => {
    const accessToken = await this.accessTokenRepository.find(accessTokenValue);
    this.validateAccessToken(accessToken);
  };

  private validateAccessToken = (accessToken: AccessToken) => {
    if (!accessToken.valid) {
      throw new InvalidToken();
    }
  };
}

export default Authenticate;
