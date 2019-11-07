import Authenticate from "../actions/Authenticate";
import Activate from "../actions/Activate";
import Refresh from "../actions/Refresh";
import Login from "../actions/Login";
import Register from "../actions/Register";
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
  activate: new Activate(deps.activationSecretRepository, deps.accountRepository).exec,
  refresh: new Refresh(deps.refreshTokenRepository, deps.tokenFactory).exec,
  login: new Login(deps.accountRepository, deps.tokenFactory, deps.passwordResolver).exec,
  register: new Register(deps.accountRepository, deps.activationSecretRepository, deps.activationSecretExpiration).exec,
});
