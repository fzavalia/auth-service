package web.routes

import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.model.headers.RawHeader
import akka.http.scaladsl.server.ContentNegotiator.Alternative.ContentType
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import spray.json._

case class LoginRequest(username: String, password: String)

case class LoginResponse(accessToken: String)

object LoginRouteJsonSupport extends DefaultJsonProtocol {
  implicit val loginRequestFormat: RootJsonFormat[LoginRequest]   = jsonFormat2(LoginRequest)
  implicit val loginResponseFormat: RootJsonFormat[LoginResponse] = jsonFormat1(LoginResponse)
}

object LoginRoute extends RouteBase[LoginRequest, LoginResponse] {

  import LoginRouteJsonSupport._

  def make(compute: Compute): Route =
    (path("login") & post & entity(as[LoginRequest])) { request =>
      handle(request, compute, response => response)
    }
}
