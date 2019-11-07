import InMemoryAccessTokenRepository from "../repository/inMemory/InMemoryAccessTokenRepository";
import { validateError, makeMergeRepositoryDataFunction } from "../utils/testUtils";
import { NotFound } from "../repository/inMemory/InMemoryRepository";
import { InvalidPassword } from "./Login";
import TokenFactory from "../core/TokenFactory";
import InMemoryRefreshTokenRepository from "../repository/inMemory/InMemoryRefreshTokenRepository";
import Refresh, { ExpiredRefreshToken } from "./Refresh";
import { addDays, subDays } from "date-fns";

const makeRefresh = (mergeableAccessTokensData: any, mergeableRefreshTokensData: any) => {
  const mergeAccessTokensData = makeMergeRepositoryDataFunction({
    value: { value: "value", valid: true, expiration: addDays(new Date(), 10), accountUsername: "username" },
  });
  const mergeRefreshTokensData = makeMergeRepositoryDataFunction({
    value: {
      value: "value",
      accountUsername: "username",
      expiration: addDays(new Date(), 10),
      valid: true,
      accessTokenValue: "value",
    },
  });
  const accessTokens = new InMemoryAccessTokenRepository(mergeAccessTokensData(mergeableAccessTokensData));
  const refreshTokens = new InMemoryRefreshTokenRepository(mergeRefreshTokensData(mergeableRefreshTokensData));
  const tokenFactory = new TokenFactory(accessTokens, refreshTokens, 10, 10);
  return new Refresh(refreshTokens, tokenFactory).exec;
};

describe("Refresh", () => {
  it("succeeds", async () => {
    await makeRefresh({}, {})("value", "value");
  });

  it("fails when refresh token is expired", async () => {
    const login = makeRefresh({}, { value: { expiration: subDays(new Date(), 10) } });
    try {
      await login("username", "password");
    } catch (e) {
      validateError(e, new NotFound());
    }
  });

  // it("fails when refresh token is expired", async () => {
  //   const login = makeRefresh({}, {});
  //   try {
  //     await login("unexistent", "password");
  //   } catch (e) {
  //     validateError(e, new Error());
  //   }
  // });

  // it("fails when password is invalid", async () => {
  //   const login = makeRefresh({}, {});
  //   try {
  //     await login("username", "invalid");
  //   } catch (e) {
  //     validateError(e, new InvalidPassword());
  //   }
  // });
});
