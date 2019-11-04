import RefreshTokenRepository, { RefreshToken } from "../RefreshTokenRepository";
import InMemoryTokenRepository from "./InMemoryTokenRepository";

class InMemoryRefreshTokenRepository extends InMemoryTokenRepository<RefreshToken> implements RefreshTokenRepository {
  extractIndexFromElement = (e: RefreshToken) => e.value;
}

export default InMemoryRefreshTokenRepository;
