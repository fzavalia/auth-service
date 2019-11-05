import express, { Response, response } from "express";
import bodyParser from "body-parser";
import Register from "./actions/Register";
import InMemoryAccountRepository from "./repository/inMemory/InMemoryAccountRepository";
import InMemoryActivationSecretRepository from "./repository/inMemory/InMemoryActivationSecretRepository";
import Login, { TokenFactory } from "./actions/Login";
import InMemoryAccessTokenRepository from "./repository/inMemory/InMemoryAccessTokenRepository";
import InMemoryRefreshTokenRepository from "./repository/inMemory/InMemoryRefreshTokenRepository";
import Activate from "./actions/Activate";

const accountRepository = new InMemoryAccountRepository();
const activationSecretRepository = new InMemoryActivationSecretRepository();
const accessTokenRepository = new InMemoryAccessTokenRepository();
const refreshTokenRepository = new InMemoryRefreshTokenRepository();

const tokenFactory = new TokenFactory(accessTokenRepository, refreshTokenRepository);

const register = new Register(accountRepository, activationSecretRepository).exec;
const login = new Login(accountRepository, tokenFactory).exec;
const activate = new Activate(activationSecretRepository, accountRepository).exec;

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

app.get("/refresh");

app.get("/activate", (req, res) => {
  const secret = req.query.activationSecret;
  activate(secret)
    .then(() => res.send({ message: "Account Activated" }))
    .catch(makeCatchHandler(res));
});

app.post("/register", (req, res) => {
  const body = req.body;
  register(body.username, body.password, body.passwordConfirmation)
    .then(activationSecret => res.send({ activationSecret }))
    .catch(makeCatchHandler(res));
});

app.get("/validate");

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
