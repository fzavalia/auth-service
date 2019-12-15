package repository

import org.scalatest.{FunSuite, Matchers}

class AccessTokenRepositoryTest extends FunSuite with Matchers with RepositoryTest {

  private val username = "username"

  test("isValid") {

    val accessToken = accessTokenRepository.create(username)

    accessTokenRepository.isValid(accessToken) shouldBe true
    accessTokenRepository.isValid("invalid") shouldBe false
  }

  test("creating a new access token renders the previous one invalid") {

    val accessToken1 = accessTokenRepository.create(username)

    accessTokenRepository.isValid(accessToken1) shouldBe true

    val accessToken2 = accessTokenRepository.create(username)

    accessTokenRepository.isValid(accessToken2) shouldBe true
    accessTokenRepository.isValid(accessToken1) shouldBe false
  }
}
