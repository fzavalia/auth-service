import AccountRepository, {
  AccountAlreadyExists,
  Account,
  AccountNotFound
} from "./AccountRepository";

class InMemoryAccountRepository implements AccountRepository {
  constructor(private readonly accounts: Map<string, Account> = new Map()) {}

  create = (account: Account) =>
    new Promise<void>((resolve, reject) => {
      if (this.accounts.has(account.username)) {
        reject(new AccountAlreadyExists());
      } else {
        this.accounts.set(account.username, account);
        resolve();
      }
    });

  find = (username: string) =>
    new Promise<Account>((resolve, reject) => {
      const account = this.accounts.get(username);
      if (!account) {
        reject(new AccountNotFound());
      } else {
        resolve(account);
      }
    });

  update = (account: Account) =>
    new Promise<void>((resolve, reject) => {
      if (!this.accounts.has(account.username)) {
        reject(new AccountNotFound());
      } else {
        this.accounts.set(account.username, account);
        resolve();
      }
    });
}

export default InMemoryAccountRepository;
