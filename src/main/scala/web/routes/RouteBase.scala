package web.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCode, StatusCodes}
import akka.http.scaladsl.server.Directives.{complete, failWith, onComplete}
import akka.http.scaladsl.server.Route
import spray.json.DefaultJsonProtocol

import scala.concurrent.Future
import scala.util.{Failure, Success}

trait RouteException extends Exception {
  val statusCode: StatusCode
}

abstract class RouteBase[Req, E <: RouteException, Res](protected val handler: Req => Future[Either[E, Res]])
    extends DefaultJsonProtocol
    with SprayJsonSupport {

  def responseFutureHandler(request: Req)(toHttpResponse: Res => HttpResponse): Route =
    onComplete(handler(request)) {
      case Failure(exception) => failWith(exception)
      case Success(either) =>
        either match {
          case Left(exception) =>
            complete(HttpResponse(exception.statusCode))
          case Right(response) =>
            complete(toHttpResponse(response))
        }
    }
}
