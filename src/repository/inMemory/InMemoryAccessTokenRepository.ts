import AccessTokenRepository, { AccessToken } from "../AccessTokenRepository";
import InMemoryTokenRepository from "./InMemoryTokenRepository";

class InMemoryAccessTokenRepository extends InMemoryTokenRepository<AccessToken> implements AccessTokenRepository {
  extractIndexFromElement = (e: AccessToken) => e.value;
}

export default InMemoryAccessTokenRepository;
