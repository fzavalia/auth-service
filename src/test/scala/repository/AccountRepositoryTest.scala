package repository

import org.h2.jdbc.JdbcSQLException
import org.scalatest.{BeforeAndAfter, FunSuite}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration._

class AccountRepositoryTest extends FunSuite with BeforeAndAfter {

  private val connection: DBConnection = DBConnection.h2

  import connection._
  import connection.api._

  private val accountRepository     = new AccountRepository(connection)
  private val accessTokenRepository = new AccessTokenRepository(connection, accountRepository)

  private def await(f: Future[_]) = Await.result(f, 5.seconds)

  private val accounts     = accountRepository.accounts
  private val accessTokens = accessTokenRepository.accessTokens

  before {
    await(db.run((accounts.schema ++ accessTokens.schema).createIfNotExists))
  }

  after {
    await(db.run(DBIO.seq(accounts.delete, accessTokens.delete)))
  }

  test("create and find") {
    accountRepository.create(Account("username", "password"))
    accountRepository.find("username")
  }

  test("fails when creating an account with existing username") {
    assertThrows[JdbcSQLException] {
      accountRepository.create(Account("username", "password"))
      accountRepository.create(Account("username", "password"))
    }
  }

  test("fails when not finding an account with the given username") {
    assertThrows[NoSuchElementException] {
      accountRepository.find("username")
    }
  }

}
