import java.util.Date
import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{HttpResponse, StatusCode, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.mindrot.jbcrypt.BCrypt
import spray.json._
import scala.concurrent.{Await, ExecutionContext, ExecutionContextExecutor, Future}
import scala.io.StdIn
import scala.util.Try
import scala.concurrent.duration._
import slick.jdbc.PostgresProfile.api._

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
        val accessToken: String = AccessTokenFactory.make
        complete(LoginResponse(accessToken))
      }
    },
    (path("auth") & post & entity(as[AuthRequest])) { req =>
      if (AccessTokenValidator.isInvalid(req.accessToken)) {
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

  println("Listening on http://0.0.0.0:8008")

  StdIn.readLine()

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}

object AccountRepository {

  val db = Database.forConfig("postgres")

  case class AccountsTableRow(username: String, password: String)

  class AccountsTable(tag: Tag) extends Table[AccountsTableRow](tag, "accounts") {
    def username = column[String]("username", O.PrimaryKey)
    def password = column[String]("password")
    def foo      = column[String]("foo")
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

object Password {
  private val rounds                                    = 10
  private val salt: String                              = BCrypt.gensalt(rounds)
  def hash(password: String): String                    = BCrypt.hashpw(password, salt)
  def isValid(plain: String, hashed: String): Boolean   = BCrypt.checkpw(plain, hashed)
  def isInvalid(plain: String, hashed: String): Boolean = !isValid(plain, hashed)
}

object AccessTokenFactory {

  private val secret = "secret"

  val algorithm: Algorithm = Algorithm.HMAC256(secret)

  def make: String = {
    val nowMillis        = System.currentTimeMillis()
    val expirationMillis = nowMillis + TimeUnit.DAYS.toMillis(1)
    val issuedAt         = new Date(nowMillis)
    val expiresAt        = new Date(expirationMillis)
    JWT
      .create()
      .withIssuedAt(issuedAt)
      .withExpiresAt(expiresAt)
      .sign(algorithm)
  }
}

object AccessTokenValidator {
  def isInvalid(accessToken: String): Boolean =
    Try(JWT.require(AccessTokenFactory.algorithm).build().verify(accessToken)).isFailure
}
