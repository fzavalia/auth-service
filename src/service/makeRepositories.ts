import { InMemoryRepositoryElements } from "../repository/inMemory/InMemoryRepository";
import { ActivationSecret } from "../repository/ActivationSecretRepository";
import { AccessToken } from "../repository/AccessTokenRepository";
import { RefreshToken } from "../repository/RefreshTokenRepository";
import { Account } from "../repository/AccountRepository";
import InMemoryAccountRepository from "../repository/inMemory/InMemoryAccountRepository";
import InMemoryActivationSecretRepository from "../repository/inMemory/InMemoryActivationSecretRepository";
import InMemoryAccessTokenRepository from "../repository/inMemory/InMemoryAccessTokenRepository";
import InMemoryRefreshTokenRepository from "../repository/inMemory/InMemoryRefreshTokenRepository";

export interface InMemoryDB {
  accounts: InMemoryRepositoryElements<Account>;
  activationSecrets: InMemoryRepositoryElements<ActivationSecret>;
  accessTokens: InMemoryRepositoryElements<AccessToken>;
  refreshTokens: InMemoryRepositoryElements<RefreshToken>;
}

export default {
  inMemory: (db: InMemoryDB) => ({
    accountRepository: new InMemoryAccountRepository(db.accounts),
    activationSecretRepository: new InMemoryActivationSecretRepository(db.activationSecrets),
    accessTokenRepository: new InMemoryAccessTokenRepository(db.accessTokens),
    refreshTokenRepository: new InMemoryRefreshTokenRepository(db.refreshTokens),
  }),
};
