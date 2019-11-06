import express, { Response } from "express";
import bodyParser from "body-parser";
import Register from "./actions/Register";
import InMemoryAccountRepository from "./repository/inMemory/InMemoryAccountRepository";
import InMemoryActivationSecretRepository from "./repository/inMemory/InMemoryActivationSecretRepository";
import Login from "./actions/Login";
import InMemoryAccessTokenRepository from "./repository/inMemory/InMemoryAccessTokenRepository";
import InMemoryRefreshTokenRepository from "./repository/inMemory/InMemoryRefreshTokenRepository";
import Activate from "./actions/Activate";
import Refresh from "./actions/Refresh";
import { InMemoryRepositoryElements } from "./repository/inMemory/InMemoryRepository";
import { Account } from "./repository/AccountRepository";
import { ActivationSecret } from "./repository/ActivationSecretRepository";
import { AccessToken } from "./repository/AccessTokenRepository";
import { RefreshToken } from "./repository/RefreshTokenRepository";
import TokenFactory from "./core/TokenFactory";
import Authenticate from "./actions/Authenticate";
import * as config from "./config";

interface DB {
  accounts: InMemoryRepositoryElements<Account>;
  activationSecrets: InMemoryRepositoryElements<ActivationSecret>;
  accessTokens: InMemoryRepositoryElements<AccessToken>;
  refreshTokens: InMemoryRepositoryElements<RefreshToken>;
}

const db: DB = {
  accounts: {},
  activationSecrets: {},
  accessTokens: {},
  refreshTokens: {},
};

const accountRepository = new InMemoryAccountRepository(db.accounts);
const activationSecretRepository = new InMemoryActivationSecretRepository(db.activationSecrets);
const accessTokenRepository = new InMemoryAccessTokenRepository(db.accessTokens);
const refreshTokenRepository = new InMemoryRefreshTokenRepository(db.refreshTokens);

const tokenFactory = new TokenFactory(
  accessTokenRepository,
  refreshTokenRepository,
  config.accessTokenExpiration,
  config.refreshTokenExpiration,
);

const register = new Register(accountRepository, activationSecretRepository, config.activationSecretExpiration).exec;
const login = new Login(accountRepository, tokenFactory).exec;
const activate = new Activate(activationSecretRepository, accountRepository).exec;
const refresh = new Refresh(refreshTokenRepository, tokenFactory).exec;
const authenticate = new Authenticate(accessTokenRepository).exec;

const makeCatchHandler = (res: Response) => (e: Error) => {
  const responseError = {
    name: e.name,
    message: e.message,
    stack: process.env.NODE_ENV !== "production" ? e.stack : undefined,
  };
  res.status(400).send({
    error: responseError,
  });
};

const app = express();

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const body = req.body;
  login(body.username, body.password)
    .then(creds => res.send(creds))
    .catch(makeCatchHandler(res));
});

app.post("/refresh", (req, res) => {
  const body = req.body;
  refresh(body.accessToken, body.refreshToken)
    .then(tokens => res.send(tokens))
    .catch(makeCatchHandler(res));
});

app.post("/activate", (req, res) => {
  const activationSecret = req.body.activationSecret;
  activate(activationSecret)
    .then(() => res.send({ message: "Account Activated" }))
    .catch(makeCatchHandler(res));
});

app.post("/register", (req, res) => {
  const body = req.body;
  register(body.username, body.password, body.passwordConfirmation)
    .then(activationSecret => res.send({ activationSecret }))
    .catch(makeCatchHandler(res));
});

app.post("/authenticate", (req, res) => {
  const accessToken = req.body.accessToken;
  authenticate(accessToken)
    .then(() => res.send({ status: "ok" }))
    .catch(makeCatchHandler(res));
});

app.get("/repository", (_, res) => {
  res.send(JSON.stringify(db));
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
