import AccountRepository, { Account } from "../AccountRepository";
import InMemoryRepository, { NotFound } from "./InMemoryRepository";

class InMemoryAccountRepository extends InMemoryRepository<Account> implements AccountRepository {
  extractIndexFromElement = (e: Account) => e.username;

  activate: (username: string) => Promise<void> = username =>
    new Promise<void>((resolve, reject) => {
      const e = this.elements[username];
      if (!e) {
        reject(new NotFound());
      } else {
        e.active = true;
        resolve();
      }
    });
}

export default InMemoryAccountRepository;
