export interface Account {
  username: string;
  password: string;
  confirmation: boolean;
}

interface AccountRepository {
  create: (account: Account) => Promise<void>;
  update: (account: Account) => Promise<void>;
  find: (username: string) => Promise<Account>;
}

export class AccountNotFound extends Error {}

export default AccountRepository;
