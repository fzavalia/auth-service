import AccountRepository, { Account, AccountNotFound } from "../AccountRepository";
import InMemoryRepository from "./InMemoryRepository";

class InMemoryAccountRepository extends InMemoryRepository<Account> implements AccountRepository {
  extractIndexFromElement = (e: Account) => e.username;

  update = (account: Account) =>
    new Promise<void>((resolve, reject) => {
      if (!this.elements[account.username]) {
        reject(new AccountNotFound());
      } else {
        this.elements[account.username] = account;
        resolve();
      }
    });
}

export default InMemoryAccountRepository;
