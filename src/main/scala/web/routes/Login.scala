package web.routes

import akka.http.scaladsl.model.HttpResponse
import akka.http.scaladsl.server.Directives.{as, entity, path, post}
import akka.http.scaladsl.server.Route
import spray.json.{RootJsonFormat, _}

case class LoginRequest(username: String, password: String)

case class LoginResponse(accessToken: String)

class Login extends RouteBase[LoginRequest, LoginResponse] {

  implicit private val loginRequestFormat: RootJsonFormat[LoginRequest]   = jsonFormat2(LoginRequest)
  implicit private val loginResponseFormat: RootJsonFormat[LoginResponse] = jsonFormat1(LoginResponse)

  def make(compute: Compute): Route =
    (path("login") & post & entity(as[LoginRequest])) { request =>
      handle(request, compute, response => HttpResponse(entity = response.toJson.prettyPrint))
    }
}
