package web

import org.scalatest.{AsyncWordSpec, Matchers, WordSpec}
import web.handlers.RegisterHandler

import scala.concurrent.ExecutionContext

class RegisterHandlerTest extends AsyncWordSpec with Matchers {

  implicit val ec: ExecutionContext = ExecutionContext.global

  "RegisterHandler" should {

    "succeed when passwords match" in {
      val rh = new RegisterHandler()
      rh.handle(RegisterRequest("username", "password", "password")).map(_.isRight shouldBe true)
    }

    "fail with handled error when passwords don't match" in {
      val rh = new RegisterHandler()
      rh.handle(RegisterRequest("username", "password", "other")).map {
        case Left(ex) => ex.shouldBe(PasswordConfirmationMismatch)
      }
    }
  }
}
