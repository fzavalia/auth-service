export interface Account {
  username: string;
  password: string;
  confirmation: boolean;
}

interface AccountRepository {
  create: (account: Account) => Promise<void>;
  find: (username: string) => Promise<Account>;
  update: (username: string, account: Account) => Promise<void>;
}

export class InMemoryAccountRepository implements AccountRepository {
  constructor(private readonly accounts: Map<string, Account>) {}

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

  update = (username: string, account: Account) =>
    new Promise<void>((resolve, reject) => {
      if (!this.accounts.has(username)) {
        reject(new AccountNotFound());
      } else {
        this.accounts.set(username, account);
        resolve();
      }
    });
}

export class AccountAlreadyExists extends Error {}

export class AccountNotFound extends Error {}

export default AccountRepository;
