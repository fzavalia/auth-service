import core.AccessToken
import web.handlers.{LoginHandler, RegisterHandler}
import web.{Routes, Server, ServerConfig}

import scala.concurrent.{ExecutionContext, Future}

object Main extends App {

  implicit val ex = ExecutionContext.global

  new Server(
    ServerConfig("localhost", 8080),
    Routes(
      new RegisterHandler(),
      new LoginHandler(
        (_: String) => Future(None),
        () => AccessToken("accessToken")
      ),
      _ => Future { Right() }
    )
  )
}
