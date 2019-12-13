import java.sql.Timestamp
import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCode, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import org.mindrot.jbcrypt.BCrypt
import slick.jdbc.PostgresProfile.api._
import spray.json._

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)
case class LoginRequest(username: String, password: String)
case class LoginResponse(accessToken: String)
case class AuthRequest(accessToken: String)
case class ErrorResponse(message: String)

object Main extends App with DefaultJsonProtocol with SprayJsonSupport {

  implicit private val system: ActorSystem          = ActorSystem("server")
  implicit private val ex: ExecutionContextExecutor = ExecutionContext.global

  implicit private val registerRequestFormat: RootJsonFormat[RegisterRequest] = jsonFormat3(RegisterRequest)
  implicit private val loginRequestFormat: RootJsonFormat[LoginRequest]       = jsonFormat2(LoginRequest)
  implicit private val loginResponseFormat: RootJsonFormat[LoginResponse]     = jsonFormat1(LoginResponse)
  implicit private val authRequestFormat: RootJsonFormat[AuthRequest]         = jsonFormat1(AuthRequest)
  implicit private val errorResponseFormat: RootJsonFormat[ErrorResponse]     = jsonFormat1(ErrorResponse)

  private val routes: Route = concat(
    (path("register") & post & entity(as[RegisterRequest])) { req =>
      if (req.password != req.passwordConfirmation) {
        completeWithError(StatusCodes.BadRequest, "Passwords do not match!")
      } else {
        AccountRepository.create(Account(req.username, req.password))
        complete(HttpResponse(StatusCodes.OK))
      }
    },
    (path("login") & post & entity(as[LoginRequest])) { req =>
      val account = AccountRepository.find(req.username)
      if (Password.isInvalid(req.password, account.password)) {
        completeWithError(StatusCodes.Unauthorized, "Invalid Credentials!")
      } else {
        val accessToken = AccessTokenRepository.create(req.username)
        complete(LoginResponse(accessToken))
      }
    },
    (path("auth") & post & entity(as[AuthRequest])) { req =>
      if (!AccessTokenRepository.isValid(req.accessToken)) {
        completeWithError(StatusCodes.Unauthorized, "Invalid Access Token!")
      } else {
        complete(HttpResponse(StatusCodes.OK))
      }
    }
  )

  private def completeWithError(statusCode: StatusCode, message: String) = {
    val error = ErrorResponse(message).toJson.prettyPrint
    complete(HttpResponse(statusCode, entity = error))
  }

  private val bindingFuture: Future[Http.ServerBinding] =
    Http().bindAndHandle(routes, "0.0.0.0", 8080)

  println("Listening on http://0.0.0.0:8080")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}

object DBConnection {
  val db = Database.forConfig("postgres")
}

object AccountRepository {

  import DBConnection._

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

object AccessTokenRepository {

  import DBConnection._

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

object Password {
  private val rounds                                    = 10
  private val salt: String                              = BCrypt.gensalt(rounds)
  def hash(password: String): String                    = BCrypt.hashpw(password, salt)
  def isValid(plain: String, hashed: String): Boolean   = BCrypt.checkpw(plain, hashed)
  def isInvalid(plain: String, hashed: String): Boolean = !isValid(plain, hashed)
}
