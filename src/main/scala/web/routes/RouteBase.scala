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

abstract class RouteBase[Req, Res] extends DefaultJsonProtocol with SprayJsonSupport {

  type Compute = Req => Future[Either[RouteException, Res]]

  protected def handle(req: Req, compute: Compute, map: Res => HttpResponse): Route =
    onComplete(compute(req)) {
      case Failure(exception) => failWith(exception)
      case Success(either) =>
        either match {
          case Left(exception) =>
            complete(HttpResponse(exception.statusCode))
          case Right(response) =>
            complete(map(response))
        }
    }

  protected def handle(req: Req, compute: Compute): Route =
    handle(req, compute, _ => HttpResponse(StatusCodes.OK))

  def make(compute: Compute): Route
}
