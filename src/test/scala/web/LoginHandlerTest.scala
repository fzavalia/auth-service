package web

import core.{AccessToken, AccessTokenFactory, Account, AccountRepository, Password}
import org.scalatest.{AsyncWordSpec, Matchers}
import web.handlers.LoginHandler

import scala.concurrent.{ExecutionContext, Future}

class LoginHandlerTest extends AsyncWordSpec with Matchers {

  implicit val ec: ExecutionContext = ExecutionContext.global

  val accountPassword  = "1234"
  val accessTokenValue = "accessToken"

  val accountRepositoryWithUser: AccountRepository = (username: String) =>
    Future(Some(Account(username, Password(accountPassword).hash())))

  val accessTokenFactory: AccessTokenFactory = () => AccessToken(accessTokenValue)

  "LoginHandler" should {

    "succeed when the username and password belong to a registered user" in {
      new LoginHandler(accountRepositoryWithUser, accessTokenFactory)
        .handle(LoginRequest("username", accountPassword))
        .map {
          case Right(lr) => lr.accessToken shouldBe accessTokenValue
        }
    }

    "fail when the username was not registered previously" in {

      val accountRepositoryWithoutUser: AccountRepository = (_: String) => Future(None)

      new LoginHandler(accountRepositoryWithoutUser, accessTokenFactory)
        .handle(LoginRequest("username", accountPassword))
        .map {
          case Left(ex) => ex shouldBe InvalidCredentials
        }
    }

    "fail when the password does not match with the one of the registered user" in {
      new LoginHandler(accountRepositoryWithUser, accessTokenFactory)
        .handle(LoginRequest("username", "invalidPassword"))
        .map {
          case Left(ex) => ex shouldBe InvalidCredentials
        }
    }
  }
}
