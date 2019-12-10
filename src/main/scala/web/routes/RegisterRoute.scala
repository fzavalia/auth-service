package web.routes

import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.RootJsonFormat

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)

class RegisterRoute extends RouteBase[RegisterRequest, Unit] {

  implicit private val registerRequestFormat: RootJsonFormat[RegisterRequest] = jsonFormat3(RegisterRequest)

  def make(compute: Compute): Route =
    (path("register") & post & entity(as[RegisterRequest]))(req => handle(req, compute))
}
