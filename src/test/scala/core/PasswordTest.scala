package core

import org.scalatest.{FunSuite, Matchers}

class PasswordTest extends FunSuite with Matchers {

  test("hashing and validation") {

    val password = "1234"
    val hashed   = Password.hash(password)

    Password.isValid(password, hashed) shouldBe true
  }

}
