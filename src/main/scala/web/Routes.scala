package web

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import spray.json.DefaultJsonProtocol
import scala.concurrent.Future

case class Routes(
    registerHandler: RegisterRequest => Future[Either[RegisterException, Unit]],
    loginHandler: LoginRequest => Future[Either[LoginException, LoginResponse]],
    authenticateHandler: AuthenticateRequest => Future[Either[AuthenticationException, Unit]])
    extends DefaultJsonProtocol
    with SprayJsonSupport {

  protected implicit val registerRequestFormat     = jsonFormat3(RegisterRequest)
  protected implicit val loginRequestFormat        = jsonFormat2(LoginRequest)
  protected implicit val loginResponseFormat       = jsonFormat1(LoginResponse)
  protected implicit val authenticateRequestFormat = jsonFormat1(AuthenticateRequest)

  lazy val get = concat(
    path("register") {
      post {
        entity(as[RegisterRequest]) { registerRequest =>
          onSuccess(registerHandler(registerRequest)) {
            case Left(ex) => complete(HttpResponse(ex.statusCode))
            case Right(_) => complete(HttpResponse(StatusCodes.OK))
          }
        }
      }
    },
    path("login") {
      post {
        entity(as[LoginRequest]) { loginRequest =>
          onSuccess(loginHandler(loginRequest)) {
            case Left(ex)             => complete(HttpResponse(ex.statusCode))
            case Right(loginResponse) => complete(loginResponse)
          }
        }
      }
    },
    path("authenticate") {
      post {
        entity(as[AuthenticateRequest]) { authenticateRequest =>
          onSuccess(authenticateHandler(authenticateRequest)) {
            case Left(ex) => complete(HttpResponse(ex.statusCode))
            case Right(_) => complete(HttpResponse(StatusCodes.OK))
          }
        }
      }
    }
  )
}
