package web

import core.Password

import scala.concurrent.{ExecutionContext, Future}

class RegisterHandler(implicit ec: ExecutionContext) {
  def handle(register: RegisterRequest): Future[Either[RegisterException, Unit]] =
    Future {
      val password             = Password(register.password)
      val passwordConfirmation = Password(register.passwordConfirmation)
      if (password != passwordConfirmation) Left(PasswordConfirmationMismatch)
      else Right()
    }
}
