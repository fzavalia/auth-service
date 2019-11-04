import RefreshTokenRepository, {
  RefreshToken,
  RefreshTokenAlreadyExists,
  RefreshTokenNotFound
} from "./RefreshTokenRepository";

class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    private readonly refreshTokens: Map<string, RefreshToken> = new Map()
  ) {}

  create = (refreshToken: RefreshToken) =>
    new Promise<void>((resolve, reject) => {
      if (this.refreshTokens.has(refreshToken.value)) {
        reject(new RefreshTokenAlreadyExists());
      } else {
        this.refreshTokens.set(refreshToken.value, refreshToken);
        resolve();
      }
    });

  find = (value: string) =>
    new Promise<RefreshToken>((resolve, reject) => {
      const account = this.refreshTokens.get(value);
      if (!account) {
        reject(new RefreshTokenNotFound());
      } else {
        resolve(account);
      }
    });

  invalidateAllForAccount = (accountUsername: string) =>
    new Promise<void>(resolve => {
      const invalidatable: RefreshToken[] = [];
      this.refreshTokens.forEach(accessToken => {
        if (accessToken.accountUsername === accountUsername) {
          invalidatable.push(accessToken);
        }
      });
      invalidatable.forEach(i => (i.valid = false));
      resolve();
    });
}

export default InMemoryRefreshTokenRepository;
