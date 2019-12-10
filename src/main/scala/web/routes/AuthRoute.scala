package web.routes

import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.RootJsonFormat

case class AuthRequest(accessToken: String)

trait AuthException extends RouteException

object AuthRoute extends RouteBase[AuthRequest, Unit] {

  implicit private val authRequestFormat: RootJsonFormat[AuthRequest] = jsonFormat1(AuthRequest)

  def make(compute: Compute): Route =
    (path("auth") & post & entity(as[AuthRequest]))(req => handle(req, compute))
}
