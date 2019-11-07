import InMemoryActivationSecretRepository from "../repository/inMemory/InMemoryActivationSecretRepository";
import Activate, { UsedActivationSecret, AccountAlreadyActive, ExpiredActivationSecret } from "./Activate";
import InMemoryAccountRepository from "../repository/inMemory/InMemoryAccountRepository";
import { addDays, subDays } from "date-fns";
import { makeMergeRepositoryDataFunction, validateError } from "../utils/testUtils";
import { NotFound } from "../repository/inMemory/InMemoryRepository";

const activationSecretRepoDataMerge = makeMergeRepositoryDataFunction({
  value: {
    value: "value",
    accountUsername: "username",
    expiration: addDays(new Date(), 1),
    used: false,
  },
});

const accountRepoDataMerge = makeMergeRepositoryDataFunction({
  username: {
    username: "username",
    active: false,
    password: "password",
  },
});

const makeActivate = (opts: { activationSecretRepoMergeData?: any; accountRepoMergeData?: any }) => {
  const activationSecretRepoData = activationSecretRepoDataMerge(opts.activationSecretRepoMergeData);
  const activationSecretRepo = new InMemoryActivationSecretRepository(activationSecretRepoData);
  const accountRepoData = accountRepoDataMerge(opts.accountRepoMergeData);
  const accountRepo = new InMemoryAccountRepository(accountRepoData);
  return new Activate(activationSecretRepo, accountRepo).exec;
};

describe("Activate", () => {
  it("activates successfuly", async () => {
    await makeActivate({})("value");
  });

  it("fails when activation secret does not exist", async () => {
    const activate = makeActivate({ activationSecretRepoMergeData: { value: { used: true } } });
    try {
      await activate("other");
    } catch (e) {
      validateError(e, new NotFound());
    }
  });

  it("fails when activation secret was already used", async () => {
    const activate = makeActivate({ activationSecretRepoMergeData: { value: { used: true } } });
    try {
      await activate("value");
    } catch (e) {
      validateError(e, new UsedActivationSecret());
    }
  });

  it("fails when account was already activated", async () => {
    const activate = makeActivate({ accountRepoMergeData: { username: { active: true } } });
    try {
      await activate("value");
    } catch (e) {
      validateError(e, new AccountAlreadyActive());
    }
  });

  it("fails when activation secret is expired", async () => {
    const activate = makeActivate({
      activationSecretRepoMergeData: {
        value: { expiration: subDays(new Date(), 10) },
      },
    });
    try {
      await activate("value");
    } catch (e) {
      validateError(e, new ExpiredActivationSecret());
    }
  });
});
