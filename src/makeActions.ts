import Authenticate from "./actions/Authenticate";
import Activate from "./actions/Activate";
import Refresh from "./actions/Refresh";
import Login from "./actions/Login";
import Register from "./actions/Register";
import AccessTokenRepository from "./repository/AccessTokenRepository";
import ActivationSecretRepository from "./repository/ActivationSecretRepository";
import AccountRepository from "./repository/AccountRepository";
import RefreshTokenRepository from "./repository/RefreshTokenRepository";
import TokenFactory from "./core/TokenFactory";

export default (args: {
  accessTokenRepository: AccessTokenRepository;
  activationSecretRepository: ActivationSecretRepository;
  accountRepository: AccountRepository;
  refreshTokenRepository: RefreshTokenRepository;
  tokenFactory: TokenFactory;
  activationSecretExpiration: number;
}) => ({
  authenticate: new Authenticate(args.accessTokenRepository).exec,
  activate: new Activate(args.activationSecretRepository, args.accountRepository).exec,
  refresh: new Refresh(args.refreshTokenRepository, args.tokenFactory).exec,
  login: new Login(args.accountRepository, args.tokenFactory).exec,
  register: new Register(args.accountRepository, args.activationSecretRepository, args.activationSecretExpiration).exec,
});
