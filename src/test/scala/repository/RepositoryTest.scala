package repository

import org.scalatest.{BeforeAndAfter, Suite}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration._

trait RepositoryTest extends Suite with BeforeAndAfter {

  private val connection: DBConnection = DBConnection.h2

  import connection._
  import connection.api._

  protected val accountRepository     = new AccountRepository(connection)
  protected val accessTokenRepository = new AccessTokenRepository(connection, accountRepository)

  protected def await[T](f: Future[T]): T = Await.result(f, 5.seconds)

  private val accounts     = accountRepository.accounts
  private val accessTokens = accessTokenRepository.accessTokens

  before {
    await(db.run((accounts.schema ++ accessTokens.schema).createIfNotExists))
  }

  after {
    await(db.run(DBIO.seq(accounts.delete, accessTokens.delete)))
  }
}
