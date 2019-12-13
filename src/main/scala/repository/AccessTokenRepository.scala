package repository

import java.sql.Timestamp
import java.util.concurrent.TimeUnit

import scala.concurrent.Await
import scala.concurrent.duration._

object AccessTokenRepository {

  import DBConnection._
  import api._

  case class AccessTokenTableRow(value: String, username: String, created: Timestamp, deprecated: Boolean)

  class AccessTokenTable(tag: Tag) extends Table[AccessTokenTableRow](tag, "access_tokens") {
    def value      = column[String]("value", O.PrimaryKey)
    def username   = column[String]("username")
    def created    = column[Timestamp]("created")
    def deprecated = column[Boolean]("deprecated")
    def *          = (value, username, created, deprecated) <> (AccessTokenTableRow.tupled, AccessTokenTableRow.unapply)
    def account    = foreignKey("account_fk", username, AccountRepository.accounts)(_.username)
  }

  val accessTokens = TableQuery[AccessTokenTable]

  def create(username: String): String = {
    val deprecate = accessTokens
      .filter(_.username === username)
      .map(_.deprecated)
      .update(true)
    val accessToken         = java.util.UUID.randomUUID().toString
    val nowMillis           = System.currentTimeMillis()
    val created             = new Timestamp(nowMillis)
    val accessTokenTableRow = AccessTokenTableRow(accessToken, username, created, deprecated = false)
    val create              = accessTokens += accessTokenTableRow
    Await.result(db.run(DBIO.seq(deprecate, create).transactionally), 5.seconds)
    accessToken
  }

  def isValid(accessToken: String): Boolean = {
    val listAccessTokens = accessTokens
      .filter(_.value === accessToken)
      .filter(_.deprecated === false)
      .result
    val queryResult = Await.result(db.run(listAccessTokens), 5.seconds)
    val limit       = new Timestamp(System.currentTimeMillis - TimeUnit.DAYS.toMillis(1))
    queryResult.nonEmpty && queryResult.forall(_.created.after(limit))
  }
}
