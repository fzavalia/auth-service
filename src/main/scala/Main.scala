import web.{LoginResponse, Routes, Server, ServerConfig}

import scala.concurrent.{ExecutionContext, Future}

object Main extends App {

  implicit val ex = ExecutionContext.global

  new Server(ServerConfig("localhost", 8080),
             Routes(_ => Future { Right() },
                    _ => Future { Right(LoginResponse("accessToken")) },
                    _ => Future { Right() }))
}
