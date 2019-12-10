package web

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Route
import web.routes.AuthRoute

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn

class Server {

  implicit val system: ActorSystem          = ActorSystem("server")
  implicit val ex: ExecutionContextExecutor = ExecutionContext.global

  val routes: Route = AuthRoute.make(_ => Future.successful(Right()))

  val bindingFuture: Future[Http.ServerBinding] =
    Http().bindAndHandle(routes, "0.0.0.0", 8080)

  println("Listening on http://0.0.0.0:8008")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
