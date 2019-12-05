package web

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import spray.json.DefaultJsonProtocol
import scala.concurrent.Future

object RoutesJsonSupport extends DefaultJsonProtocol {
  implicit val registerRequestFormat     = jsonFormat3(RegisterRequest)
  implicit val loginRequestFormat        = jsonFormat2(LoginRequest)
  implicit val loginResponseFormat       = jsonFormat1(LoginResponse)
  implicit val authenticateRequestFormat = jsonFormat1(AuthenticateRequest)
}

case class Routes(
    register: RegisterHandler,
    login: LoginRequest => Future[Either[LoginException, LoginResponse]],
    authenticate: AuthenticateRequest => Future[Either[AuthenticationException, Unit]])
    extends SprayJsonSupport {

  import RoutesJsonSupport._

  lazy val get = concat(
    path("register") {
      post {
        entity(as[RegisterRequest]) { registerRequest =>
          onSuccess(register.handle(registerRequest)) {
            case Left(ex) => complete(HttpResponse(ex.statusCode))
            case Right(_) => complete(HttpResponse(StatusCodes.OK))
          }
        }
      }
    },
    path("login") {
      post {
        entity(as[LoginRequest]) { loginRequest =>
          onSuccess(login(loginRequest)) {
            case Left(ex)             => complete(HttpResponse(ex.statusCode))
            case Right(loginResponse) => complete(loginResponse)
          }
        }
      }
    },
    path("authenticate") {
      post {
        entity(as[AuthenticateRequest]) { authenticateRequest =>
          onSuccess(authenticate(authenticateRequest)) {
            case Left(ex) => complete(HttpResponse(ex.statusCode))
            case Right(_) => complete(HttpResponse(StatusCodes.OK))
          }
        }
      }
    }
  )
}
