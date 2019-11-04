import AccessTokenRepository, {
  AccessToken,
  AccessTokenAlreadyExists,
  AccessTokenNotFound
} from "./AccessTokenRepository";

class InMemoryAccessTokenRepository implements AccessTokenRepository {
  constructor(
    private readonly accessTokens: Map<string, AccessToken> = new Map()
  ) {}

  create = (accessToken: AccessToken) =>
    new Promise<void>((resolve, reject) => {
      if (this.accessTokens.has(accessToken.value)) {
        reject(new AccessTokenAlreadyExists());
      } else {
        this.accessTokens.set(accessToken.value, accessToken);
        resolve();
      }
    });

  find = (value: string) =>
    new Promise<AccessToken>((resolve, reject) => {
      const account = this.accessTokens.get(value);
      if (!account) {
        reject(new AccessTokenNotFound());
      } else {
        resolve(account);
      }
    });

  invalidateAllForAccount = (accountUsername: string) =>
    new Promise<void>(resolve => {
      const invalidatable: AccessToken[] = [];
      this.accessTokens.forEach(accessToken => {
        if (accessToken.accountUsername === accountUsername) {
          invalidatable.push(accessToken);
        }
      });
      invalidatable.forEach(i => (i.valid = false));
      resolve();
    });
}

export default InMemoryAccessTokenRepository;
