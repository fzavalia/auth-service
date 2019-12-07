package core

import scala.concurrent.Future

trait AccountRepository {
  def find(username: String): Future[Option[Account]]
}

case class Account(username: String, password: HashedPassword)
