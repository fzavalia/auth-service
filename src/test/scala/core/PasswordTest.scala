package core

import org.scalatest.{Matchers, WordSpec}

class PasswordTest extends WordSpec with Matchers {

  "Password" should {

    "can be hashed and matched" in {
      val pwd       = Password("myPassword")
      val hashedPwd = pwd.hash()
      hashedPwd.matches(pwd)
    }

    "can be compared" in {
      val pwd1 = Password("foo")
      val pwd2 = Password("foo")
      pwd1 shouldEqual pwd2
    }
  }
}




