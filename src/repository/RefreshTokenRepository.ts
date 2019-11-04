interface RefreshToken {
  value: string;
  valid: boolean;
  accountUsername: string;
  accessTokenValue: string;
}

interface RefreshTokenRepository {
  find: (value: string) => Promise<RefreshToken>;
  create: (token: RefreshToken) => Promise<void>;
  invalidateAllForAccount: (accountUsername: string) => Promise<void>;
}

export default RefreshTokenRepository;
