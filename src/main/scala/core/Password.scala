package core

import org.mindrot.jbcrypt.BCrypt

object Password {
  private lazy val salt = BCrypt.gensalt(10)
}

case class Password(value: String) {
  def hash(): HashedPassword = HashedPassword(BCrypt.hashpw(value, Password.salt))
}
