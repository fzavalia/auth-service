package web.routes

import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.RootJsonFormat
import spray.json._

import scala.concurrent.Future

case class LoginRequest(username: String, password: String)

case class LoginResponse(accessToken: String)

trait LoginException extends RouteException

class LoginRoute(handler: LoginRequest => Future[Either[LoginException, LoginResponse]])
    extends RouteBase[LoginRequest, LoginException, LoginResponse](handler) {

  implicit private val loginRequestFormat: RootJsonFormat[LoginRequest]   = jsonFormat2(LoginRequest)
  implicit private val loginResponseFormat: RootJsonFormat[LoginResponse] = jsonFormat1(LoginResponse)

  def get: Route =
    (path("login") & post & entity(as[LoginRequest])) { request =>
      responseFutureHandler(request) { response =>
        HttpResponse(entity = response.toJson.prettyPrint)
      }
    }
}
