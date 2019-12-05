package web

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import scala.concurrent.ExecutionContext
import scala.io.StdIn

case class ServerConfig(host: String, port: Int)

class Server(config: ServerConfig, routes: Routes)(implicit val ec: ExecutionContext) {

  private implicit val system = ActorSystem("server")

  private val serverBindingFuture = Http().bindAndHandle(routes.get, config.host, config.port)

  println(s"Listening on http://${config.host}:${config.port}")

  StdIn.readLine()

  serverBindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
