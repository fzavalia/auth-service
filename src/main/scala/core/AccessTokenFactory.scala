package core

trait AccessTokenFactory {
  def make(): AccessToken
}

case class AccessToken(value: String)
