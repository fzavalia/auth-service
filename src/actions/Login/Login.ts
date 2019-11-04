import AccountRepository, {
  Account
} from "../../repository/AccountRepository/AccountRepository";
import AccessTokenRepository from "../../repository/AccessTokenRepository/AccessTokenRepository";
import RefreshTokenRepository from "../../repository/RefreshTokenRepository/RefreshTokenRepository";

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

interface Login {
  exec: (username: string, password: string) => Promise<LoginResult>;
}

export interface Salt {
  validate: (data: string, hash: string) => Promise<void>;
}

export interface TokenFactory {
  makeAccessToken: () => Promise<string>;
  makeRefreshToken: () => Promise<string>;
}

export default Login;
