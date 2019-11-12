import { validateError, makeMergeRepositoryDataFunction } from "../../utils/testUtils";
import { AlreadyExists } from "../../repository/inMemory/InMemoryRepository";
import RegisterAccount, { PasswordsDoNotMatch } from "../../actions/RegisterAccount";
import InMemoryAccountRepository from "../../repository/inMemory/InMemoryAccountRepository";
import InMemoryActivationSecretRepository from "../../repository/inMemory/InMemoryActivationSecretRepository";
import { Account } from "../../repository/AccountRepository";
import { StubPasswordResolver } from "../../core/PasswordResolver";

const makeRegister = (mergeableAccountData: any) => {
  const accountsData = makeMergeRepositoryDataFunction<Account>({})(mergeableAccountData);
  const accounts = new InMemoryAccountRepository(accountsData);
  const activationSecrets = new InMemoryActivationSecretRepository();
  return new RegisterAccount(accounts, activationSecrets, new StubPasswordResolver(), 10).exec;
};

describe("Refresh", () => {
  it("succeeds", async () => {
    await makeRegister({})("username", "password", "password");
  });

  it("fails with an incorrect password confirmation", async () => {
    try {
      await makeRegister({})("username", "password", "other");
    } catch (e) {
      validateError(e, new PasswordsDoNotMatch());
    }
  });

  it("fails when another account has the same username", async () => {
    try {
      await makeRegister({ username: { username: "username", active: true, password: "password" } })(
        "username",
        "password",
        "password",
      );
    } catch (e) {
      validateError(e, new AlreadyExists());
    }
  });
});
