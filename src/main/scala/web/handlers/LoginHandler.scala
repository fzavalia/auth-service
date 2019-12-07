package web.handlers

import core.{AccessTokenFactory, AccountRepository, Password}
import web.{InvalidCredentials, LoginException, LoginRequest, LoginResponse}

import scala.concurrent.{ExecutionContext, Future}

class LoginHandler(accounts: AccountRepository, accessTokens: AccessTokenFactory)(
    implicit ec: ExecutionContext) {

  def handle(login: LoginRequest): Future[Either[LoginException, LoginResponse]] =
    accounts
      .find(login.username)
      .map {
        case Some(account) =>
          val validPassword = account.password.matches(Password(login.password))
          if (validPassword) Right(LoginResponse(accessTokens.make().value))
          else Left(InvalidCredentials)
        case None => Left(InvalidCredentials)
      }
}
