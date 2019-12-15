package repository

import org.h2.jdbc.JdbcSQLException
import org.scalatest.FunSuite

class AccountRepositoryTest extends FunSuite with RepositoryTest {

  private val username = "username"
  private val password = "password"

  test("create and find") {
    accountRepository.create(Account(username, password))
    accountRepository.find(username)
  }

  test("fails when creating an account with existing " + username) {
    assertThrows[JdbcSQLException] {
      accountRepository.create(Account(username, password))
      accountRepository.create(Account(username, password))
    }
  }

  test("fails when not finding an account with the given " + username) {
    assertThrows[NoSuchElementException] {
      accountRepository.find(username)
    }
  }

}
