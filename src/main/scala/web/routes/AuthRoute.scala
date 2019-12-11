package web.routes

import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class AuthRequest(accessToken: String)

object AuthRouteJsonSupport extends DefaultJsonProtocol {
  implicit val authRequestFormat: RootJsonFormat[AuthRequest] = jsonFormat1(AuthRequest)
}

object AuthRoute extends RouteBase[AuthRequest, Unit] {

  import AuthRouteJsonSupport._

  def make(compute: Compute): Route =
    (path("auth") & post & entity(as[AuthRequest]))(req => handle(req, compute))
}
