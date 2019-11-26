import web.{InvalidCredentials, LoginResponse, Server, ServerConfig, ServerHandlers}

import scala.concurrent.{ExecutionContext, Future}

object Main extends App {

  implicit val ex = ExecutionContext.global

  new Server(ServerConfig("localhost", 8080),
             ServerHandlers(_ => Future { Right() },
                            _ => Future { throw InvalidCredentials },
                            _ => Future { Right() }))
}
