package web.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}

import scala.concurrent.Future

class RegisterRouteTest extends WordSpec with Matchers with ScalatestRouteTest with SprayJsonSupport {

  "RegisterRouteTest" should {

    "make" in {

      import RegisterRouteJsonSupport._

      val route = RegisterRoute.make(_ => Future.successful(Right()))

      Post("/register", RegisterRequest("username", "password", "passwordConfirmation")) ~> route ~> check {
        response.status shouldBe StatusCodes.OK
      }
    }
  }
}
