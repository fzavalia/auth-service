package core

import org.mindrot.jbcrypt.BCrypt

case class HashedPassword(value: String) {
  def matches(pwd: Password): Boolean = BCrypt.checkpw(pwd.value, value)
}
