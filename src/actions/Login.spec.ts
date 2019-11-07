import InMemoryAccessTokenRepository from "../repository/inMemory/InMemoryAccessTokenRepository";
import { validateError, makeMergeRepositoryDataFunction } from "../utils/testUtils";
import { NotFound } from "../repository/inMemory/InMemoryRepository";
import Login, { InvalidPassword, InactiveAccount } from "./Login";
import InMemoryAccountRepository from "../repository/inMemory/InMemoryAccountRepository";
import TokenFactory from "../core/TokenFactory";
import InMemoryRefreshTokenRepository from "../repository/inMemory/InMemoryRefreshTokenRepository";
import { StubPasswordResolver } from "../core/PasswordResolver";

const makeLogin = (mergeableRepoData: any) => {
  const mergeRepositoryData = makeMergeRepositoryDataFunction({
    username: { password: "password", active: true, username: "username" },
  });
  const accounts = new InMemoryAccountRepository(mergeRepositoryData(mergeableRepoData));
  const accessTokens = new InMemoryAccessTokenRepository();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const tokenFactory = new TokenFactory(accessTokens, refreshTokens, 10, 10);
  return new Login(accounts, tokenFactory, new StubPasswordResolver()).exec;
};

describe("Login", () => {
  it("succeeds", async () => {
    await makeLogin({})("username", "password");
  });

  it("fails when username is invalid", async () => {
    const login = makeLogin({});
    try {
      await login("unexistent", "password");
    } catch (e) {
      validateError(e, new NotFound());
    }
  });

  it("fails when password is invalid", async () => {
    const login = makeLogin({});
    try {
      await login("username", "invalid");
    } catch (e) {
      validateError(e, new InvalidPassword());
    }
  });

  it("fails when account is not active", async () => {
    const login = makeLogin({ username: { active: false } });
    try {
      await login("username", "password");
    } catch (e) {
      validateError(e, new InactiveAccount());
    }
  });
});
