import Authenticate from "../actions/Authenticate";
import ActivateAccount from "../actions/ActivateAccount";
import RefreshAccessToken from "../actions/RefreshAccessToken";
import Login from "../actions/Login";
import RegisterAccount from "../actions/RegisterAccount";
import AccessTokenRepository from "../repository/AccessTokenRepository";
import ActivationSecretRepository from "../repository/ActivationSecretRepository";
import AccountRepository from "../repository/AccountRepository";
import RefreshTokenRepository from "../repository/RefreshTokenRepository";
import TokenFactory from "../core/TokenFactory";
import PasswordResolver from "../core/PasswordResolver";

export default (deps: {
  accessTokenRepository: AccessTokenRepository;
  activationSecretRepository: ActivationSecretRepository;
  accountRepository: AccountRepository;
  refreshTokenRepository: RefreshTokenRepository;
  tokenFactory: TokenFactory;
  passwordResolver: PasswordResolver;
  activationSecretExpiration: number;
}) => ({
  authenticate: new Authenticate(deps.accessTokenRepository).exec,
  activate: new ActivateAccount(deps.activationSecretRepository, deps.accountRepository).exec,
  refresh: new RefreshAccessToken(deps.refreshTokenRepository, deps.tokenFactory).exec,
  login: new Login(deps.accountRepository, deps.tokenFactory, deps.passwordResolver).exec,
  register: new RegisterAccount(
    deps.accountRepository,
    deps.activationSecretRepository,
    deps.passwordResolver,
    deps.activationSecretExpiration,
  ).exec,
});
