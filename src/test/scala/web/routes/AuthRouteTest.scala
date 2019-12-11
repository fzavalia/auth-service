package web.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{StatusCode, StatusCodes}
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}

import scala.concurrent.Future

class AuthRouteTest extends WordSpec with Matchers with ScalatestRouteTest with SprayJsonSupport {

  "AuthRouteTest" should {

    "make" in {

      import AuthRouteJsonSupport._

      val route = AuthRoute.make(_ => Future.successful(Right()))

      Post("/auth", AuthRequest("accessToken")) ~> route ~> check {
        response.status should be(StatusCodes.OK)
      }
    }
  }
}
