package web.routes

import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.RootJsonFormat

import scala.concurrent.Future

case class AuthRequest(accessToken: String)

trait AuthException extends RouteException

class AuthRoute(handler: AuthRequest => Future[Either[AuthException, Unit]])
    extends RouteBase[AuthRequest, AuthException, Unit](handler) {

  implicit private val authRequestFormat: RootJsonFormat[AuthRequest] = jsonFormat1(AuthRequest)

  def get: Route =
    (path("auth") & post & entity(as[AuthRequest])) { request =>
      responseFutureHandler(request) { _ =>
        HttpResponse(StatusCodes.OK)
      }
    }
}
