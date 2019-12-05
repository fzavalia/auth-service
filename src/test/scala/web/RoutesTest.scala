package web

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}

import scala.concurrent.Future

class RoutesTest extends WordSpec with Matchers with ScalatestRouteTest with SprayJsonSupport {

  import RoutesJsonSupport._

  val routes = Routes(new RegisterHandler(),
                      _ => Future { Right(LoginResponse("accessToken")) },
                      _ => Future { Right() }).get

  "Routes" should {

    "have a register route" in {

      Post("/register", RegisterRequest("username", "password", "password")) ~> routes ~> check {
        response.status shouldBe StatusCodes.OK
      }

      Post("/register", RegisterRequest("username", "password", "other")) ~> routes ~> check {
        response.status shouldBe PasswordConfirmationMismatch.statusCode
      }
    }

    "have a login route" in {
      Post("/login", LoginRequest("username", "password")) ~> routes ~> check {
        response.status shouldBe StatusCodes.OK
        responseAs[LoginResponse].accessToken shouldBe "accessToken"
      }
    }

    "have an authenticate route" in {
      Post("/authenticate", AuthenticateRequest("accessToken")) ~> routes ~> check {
        response.status shouldBe StatusCodes.OK
      }
    }
  }
}
