export interface AccessToken {
  value: string;
  valid: boolean;
  accountUsername: string;
}

interface AccessTokenRepository {
  find: (value: string) => Promise<AccessToken>;
  create: (token: AccessToken) => Promise<void>;
  invalidateAllForAccount: (accountUsername: string) => Promise<void>;
}

export default AccessTokenRepository;
