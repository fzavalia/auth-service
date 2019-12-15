import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCode, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import core.Password
import repository.{AccessTokenRepository, Account, AccountRepository, DBConnection}
import spray.json._

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn

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

  val connection   = DBConnection.postgres
  val accounts     = new AccountRepository(connection)
  val accessTokens = new AccessTokenRepository(connection, accounts)

  private val routes: Route = concat(
    (path("register") & post & entity(as[RegisterRequest])) { req =>
      if (req.password != req.passwordConfirmation) {
        completeWithError(StatusCodes.BadRequest, "Passwords do not match!")
      } else {
        accounts.create(Account(req.username, req.password))
        complete(HttpResponse(StatusCodes.OK))
      }
    },
    (path("login") & post & entity(as[LoginRequest])) { req =>
      val account = accounts.find(req.username)
      if (!Password.isValid(req.password, account.password)) {
        completeWithError(StatusCodes.Unauthorized, "Invalid Credentials!")
      } else {
        val accessToken = accessTokens.create(req.username)
        complete(LoginResponse(accessToken))
      }
    },
    (path("auth") & post & entity(as[AuthRequest])) { req =>
      if (!accessTokens.isValid(req.accessToken)) {
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

  println("Listening on http://0.0.0.0:8080")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
