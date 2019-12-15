package core

import org.mindrot.jbcrypt.BCrypt

object Password {
  private val rounds                                    = 10
  private val salt: String                              = BCrypt.gensalt(rounds)
  def hash(password: String): String                    = BCrypt.hashpw(password, salt)
  def isValid(plain: String, hashed: String): Boolean   = BCrypt.checkpw(plain, hashed)
}
