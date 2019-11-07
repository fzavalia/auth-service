import InMemoryActivationSecretRepository from "../repository/inMemory/InMemoryActivationSecretRepository";
import Activate, { UsedActivationSecret, AccountAlreadyActive, ExpiredActivationSecret } from "./Activate";
import InMemoryAccountRepository from "../repository/inMemory/InMemoryAccountRepository";
import { addDays, subDays } from "date-fns";
import { InMemoryRepositoryElements } from "../repository/inMemory/InMemoryRepository";
import { ActivationSecret } from "../repository/ActivationSecretRepository";
import { Account } from "../repository/AccountRepository";
import CustomError from "../core/CustomError";

const makeActivationSecretRepositoryData = (merge?: any) => {
  const original: InMemoryRepositoryElements<ActivationSecret> = {
    value: {
      value: "value",
      accountUsername: "username",
      expiration: addDays(new Date(), 1),
      used: false,
    },
  };
  return Object.assign(original, merge) as InMemoryRepositoryElements<ActivationSecret>;
};

const makeAccountRepositoryData = (merge?: any) => {
  const original: InMemoryRepositoryElements<Account> = {
    username: {
      username: "username",
      active: false,
      password: "password",
    },
  };
  return Object.assign(original, merge) as InMemoryRepositoryElements<Account>;
};

const makeAction = (opts?: { activationSecretRepoMergeData?: any; accountRepoMergeData?: any }) => {
  const activationSecretRepoData = makeActivationSecretRepositoryData(
    opts ? opts.activationSecretRepoMergeData : undefined,
  );
  const activationSecretRepo = new InMemoryActivationSecretRepository(activationSecretRepoData);
  const accountRepoData = makeAccountRepositoryData(opts ? opts.accountRepoMergeData : undefined);
  const accountRepo = new InMemoryAccountRepository(accountRepoData);
  return new Activate(activationSecretRepo, accountRepo).exec;
};

const validateError = (catchedError: any, customError: CustomError) => {
  const err: Error = catchedError;
  if (err.name !== customError.name) {
    throw new Error();
  }
};

describe("Activate", () => {
  it("activates successfuly", async () => {
    await makeAction()("value");
  });

  it("fails when activation secret was already used", async () => {
    const activate = makeAction({ activationSecretRepoMergeData: { value: { used: true } } });
    try {
      await activate("value");
    } catch (e) {
      validateError(e, new UsedActivationSecret());
    }
  });

  it("fails when account was already activated", async () => {
    const activate = makeAction({ accountRepoMergeData: { username: { active: true } } });
    try {
      await activate("value");
    } catch (e) {
      validateError(e, new AccountAlreadyActive());
    }
  });

  it("fails when activation secret is expired", async () => {
    const activate = makeAction({
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
