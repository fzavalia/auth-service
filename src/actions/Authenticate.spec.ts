import Authenticate, { InvalidAccessToken, ExpiredAccessToken } from "./Authenticate";
import InMemoryAccessTokenRepository from "../repository/inMemory/InMemoryAccessTokenRepository";
import { addDays, subDays } from "date-fns";
import { validateError, makeMergeRepositoryDataFunction } from "../utils/testUtils";
import { NotFound } from "../repository/inMemory/InMemoryRepository";

const repositoryDataMerge = makeMergeRepositoryDataFunction({
  value: {
    accountUsername: "username",
    expiration: addDays(new Date(), 10),
    valid: true,
    value: "value",
  },
});

const makeAuthenticate = (mergeableRepoData: any) =>
  new Authenticate(new InMemoryAccessTokenRepository(repositoryDataMerge(mergeableRepoData))).exec;

describe("Authenticate", () => {
  it("succeeds", async () => {
    await makeAuthenticate({})("value");
  });

  it("fails when access token does not exist", async () => {
    const authenticate = makeAuthenticate({ value: { valid: false } });
    try {
      await authenticate("unexistent");
    } catch (e) {
      validateError(e, new NotFound());
    }
  });

  it("fails when access token is invalid", async () => {
    const authenticate = makeAuthenticate({ value: { valid: false } });
    try {
      await authenticate("value");
    } catch (e) {
      validateError(e, new InvalidAccessToken());
    }
  });

  it("fails when access token is expired", async () => {
    const authenticate = makeAuthenticate({ value: { expiration: subDays(new Date(), 10) } });
    try {
      await authenticate("value");
    } catch (e) {
      validateError(e, new ExpiredAccessToken());
    }
  });
});
