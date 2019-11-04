import InMemoryRepository from "./InMemoryRepository";

export interface Token {
  accountUsername: string;
  valid: boolean;
}

abstract class InMemoryTokenRepository<T extends Token> extends InMemoryRepository<T> {
  invalidateAllForAccount = (accountUsername: string) =>
    new Promise<void>(resolve => {
      Object.values(this.elements).forEach(token => {
        if (token.accountUsername === accountUsername) {
          token.valid = false;
        }
      });
      resolve();
    });
}

export default InMemoryTokenRepository;
