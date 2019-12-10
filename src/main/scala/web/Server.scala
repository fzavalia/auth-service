package web

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn

class Server extends SprayJsonSupport {

  implicit val system: ActorSystem          = ActorSystem("server")
  implicit val ex: ExecutionContextExecutor = ExecutionContext.global

  val routes: Route = path("foo") {
    complete("ok")
  }

  val bindingFuture: Future[Http.ServerBinding] =
    Http().bindAndHandle(routes, "0.0.0.0", 8080)

  println("Listening on http://0.0.0.0:8008")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
