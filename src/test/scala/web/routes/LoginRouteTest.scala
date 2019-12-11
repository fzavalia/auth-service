package web.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{MediaRanges, StatusCodes}
import akka.http.scaladsl.model.headers.Accept
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}

import scala.concurrent.Future
import spray.json._

class LoginRouteTest extends WordSpec with Matchers with ScalatestRouteTest with SprayJsonSupport {

  "LoginRouteTest" should {

    "make" in {

      import LoginRouteJsonSupport._

      val route = LoginRoute.make(_ => Future.successful(Right(LoginResponse("accessToken"))))

      Post("/login", LoginRequest("username", "password")) ~> route ~> check {
        responseAs[LoginResponse] shouldBe LoginResponse("accessToken")
      }
    }
  }
}
