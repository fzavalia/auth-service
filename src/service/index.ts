import express, { Response } from "express";
import bodyParser from "body-parser";
import TokenFactory from "../core/TokenFactory";
import * as config from "./config";
import makeActions from "./makeActions";
import makeRepositories, { InMemoryDB } from "./makeRepositories";
import { BcryptPasswordResolver } from "../core/PasswordResolver";
import TypeOrmRepository from "../repository/typeOrm/TypeOrmRepository";
import TypeOrmAccountRepository from "../repository/typeOrm/TypeOrmAccountRepository";

TypeOrmRepository.createConnection();

const db: InMemoryDB = {
  accounts: {},
  activationSecrets: {},
  accessTokens: {},
  refreshTokens: {},
};

const {
  accountRepository,
  activationSecretRepository,
  accessTokenRepository,
  refreshTokenRepository,
} = makeRepositories.inMemory(db);

const typeormAccountRepository = new TypeOrmAccountRepository();

const tokenFactory = new TokenFactory(
  accessTokenRepository,
  refreshTokenRepository,
  config.accessTokenExpiration,
  config.refreshTokenExpiration,
);

const { activate, authenticate, login, refresh, register } = makeActions({
  accessTokenRepository,
  accountRepository: typeormAccountRepository,
  activationSecretRepository,
  refreshTokenRepository,
  tokenFactory,
  activationSecretExpiration: config.activationSecretExpiration,
  passwordResolver: new BcryptPasswordResolver(),
});

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
