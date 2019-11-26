package web

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import spray.json._
import scala.concurrent.{ExecutionContext, Future}
import scala.io.StdIn

case class ServerConfig(host: String, port: Int)

case class ServerHandlers(
    registerHandler: RegisterRequest => Future[Either[RegisterException, Unit]],
    loginHandler: LoginRequest => Future[Either[LoginException, LoginResponse]],
    authenticateHandler: AuthenticateRequest => Future[Either[AuthenticationException, Unit]])

class Server(config: ServerConfig, handlers: ServerHandlers)(implicit val ec: ExecutionContext)
    extends DefaultJsonProtocol
    with SprayJsonSupport {

  private implicit val system = ActorSystem("server")

  private implicit val registerRequestFormat     = jsonFormat3(RegisterRequest)
  private implicit val loginRequestFormat        = jsonFormat2(LoginRequest)
  private implicit val loginResponseFormat       = jsonFormat1(LoginResponse)
  private implicit val authenticateRequestFormat = jsonFormat1(AuthenticateRequest)

  private val route = concat(
    (path("register") & post & entity(as[RegisterRequest])) { registerRequest =>
      onSuccess(handlers.registerHandler(registerRequest)) {
        case Left(ex) => complete(HttpResponse(ex.statusCode))
        case Right(_) => complete(HttpResponse(StatusCodes.OK))
      }
    },
    (path("login") & post & entity(as[LoginRequest])) { loginRequest =>
      onSuccess(handlers.loginHandler(loginRequest)) {
        case Left(ex)             => complete(HttpResponse(ex.statusCode))
        case Right(loginResponse) => complete(loginResponse)
      }
    },
    (path("authenticate") & post & entity(as[AuthenticateRequest])) { authenticateRequest =>
      onSuccess(handlers.authenticateHandler(authenticateRequest)) {
        case Left(ex) => complete(HttpResponse(ex.statusCode))
        case Right(_) => complete(HttpResponse(StatusCodes.OK))
      }
    }
  )

  private val serverBindingFuture = Http().bindAndHandle(route, config.host, config.port)

  StdIn.readLine()

  serverBindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
