package web.routes

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)

object RegisterRouteJsonSupport extends DefaultJsonProtocol {
  implicit val registerRequestFormat: RootJsonFormat[RegisterRequest] = jsonFormat3(RegisterRequest)
}

object RegisterRoute extends RouteBase[RegisterRequest, Unit] {

  import RegisterRouteJsonSupport._

  def make(compute: Compute): Route =
    (path("register") & post & entity(as[RegisterRequest]))(req => handle(req, compute))
}
