package web.routes

import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.RootJsonFormat

import scala.concurrent.Future

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)

trait RegisterException extends RouteException

class RegisterRoute(handler: RegisterRequest => Future[Either[RegisterException, Unit]])
    extends RouteBase[RegisterRequest, RegisterException, Unit](handler) {

  implicit private val registerRequestFormat: RootJsonFormat[RegisterRequest] = jsonFormat3(RegisterRequest)

  def get: Route =
    (path("register") & post & entity(as[RegisterRequest]))(handle)
}
