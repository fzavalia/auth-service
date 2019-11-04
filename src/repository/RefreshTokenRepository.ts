export interface RefreshToken {
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

export class RefreshTokenAlreadyExists extends Error {}

export class RefreshTokenNotFound extends Error {}

export default RefreshTokenRepository;
