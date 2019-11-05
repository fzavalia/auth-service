export interface Account {
  username: string;
  password: string;
  active: boolean;
}

interface AccountRepository {
  find: (username: string) => Promise<Account>;
  create: (account: Account) => Promise<void>;
  activate: (username: string) => Promise<void>;
}

export default AccountRepository;
