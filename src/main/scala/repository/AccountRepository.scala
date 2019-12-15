package repository

import core.Password

import scala.concurrent.Await
import scala.concurrent.duration._

class AccountRepository(protected val connection: DBConnection) {

  import connection._
  import api._

  case class AccountsTableRow(username: String, password: String)

  class AccountsTable(tag: Tag) extends Table[AccountsTableRow](tag, "accounts") {
    def username = column[String]("username", O.PrimaryKey)
    def password = column[String]("password")
    def *        = (username, password) <> (AccountsTableRow.tupled, AccountsTableRow.unapply)
  }

  val accounts = TableQuery[AccountsTable]

  def create(account: Account): Unit = {
    val insertAccount = accounts += AccountsTableRow(account.username, Password.hash(account.password))
    Await.result(db.run(insertAccount), 5.seconds)
  }

  def find(username: String): Account = {
    val findAccount  = accounts.filter(_.username === username).result.head
    val slickAccount = Await.result(db.run(findAccount), 5.seconds)
    Account(slickAccount.username, slickAccount.password)
  }
}

case class Account(username: String, password: String)
