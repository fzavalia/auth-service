import java.util.Date
import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCode, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import spray.json._

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn
import scala.util.Try

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)
case class LoginRequest(username: String, password: String)
case class LoginResponse(accessToken: String)
case class AuthRequest(accessToken: String)
case class ErrorResponse(message: String)

object Main extends App with DefaultJsonProtocol with SprayJsonSupport {

  implicit private val system: ActorSystem          = ActorSystem("server")
  implicit private val ex: ExecutionContextExecutor = ExecutionContext.global

  implicit private val registerRequestFormat: RootJsonFormat[RegisterRequest] = jsonFormat3(RegisterRequest)
  implicit private val loginRequestFormat: RootJsonFormat[LoginRequest]       = jsonFormat2(LoginRequest)
  implicit private val loginResponseFormat: RootJsonFormat[LoginResponse]     = jsonFormat1(LoginResponse)
  implicit private val authRequestFormat: RootJsonFormat[AuthRequest]         = jsonFormat1(AuthRequest)
  implicit private val errorResponseFormat: RootJsonFormat[ErrorResponse]     = jsonFormat1(ErrorResponse)

  val accountRepository: AccountRepository = null

  private val routes: Route = concat(
    (path("register") & post & entity(as[RegisterRequest])) { req =>
      if (req.password != req.passwordConfirmation) {
        completeWithError(StatusCodes.BadRequest, "Passwords do not match!")
      } else {
        accountRepository.create(Account(req.username, req.password))
        complete(HttpResponse(StatusCodes.OK))
      }
    },
    (path("login") & post & entity(as[LoginRequest])) { req =>
      val account: Account = accountRepository.find(req.username)
      if (account.password != req.password) {
        completeWithError(StatusCodes.Unauthorized, "Invalid Credentials!")
      } else {
        val accessToken: String = AccessTokenFactory.make
        complete(LoginResponse(accessToken))
      }
    },
    (path("auth") & post & entity(as[AuthRequest])) { req =>
      if (AccessTokenValidator.isInvalid(req.accessToken)) {
        completeWithError(StatusCodes.Unauthorized, "Invalid Access Token!")
      } else {
        complete(HttpResponse(StatusCodes.OK))
      }
    }
  )

  private def completeWithError(statusCode: StatusCode, message: String) = {
    val error = ErrorResponse(message).toJson.prettyPrint
    complete(HttpResponse(statusCode, entity = error))
  }

  private val bindingFuture: Future[Http.ServerBinding] =
    Http().bindAndHandle(routes, "0.0.0.0", 8080)

  println("Listening on http://0.0.0.0:8008")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}

trait AccountRepository {
  def create(account: Account): Unit
  def find(username: String): Account
}

case class Account(username: String, password: String)

object AccessTokenFactory {

  private val secret = "secret"

  val algorithm: Algorithm = Algorithm.HMAC256(secret)

  def make: String = {
    val nowMillis        = System.currentTimeMillis()
    val expirationMillis = nowMillis + TimeUnit.DAYS.toMillis(1)
    val issuedAt         = new Date(nowMillis)
    val expiresAt        = new Date(expirationMillis)
    JWT
      .create()
      .withIssuedAt(issuedAt)
      .withExpiresAt(expiresAt)
      .sign(algorithm)
  }
}

object AccessTokenValidator {
  def isInvalid(accessToken: String): Boolean =
    Try(JWT.require(AccessTokenFactory.algorithm).build().verify(accessToken)).isFailure
}
