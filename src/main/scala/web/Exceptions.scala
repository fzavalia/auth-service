package web

import akka.http.scaladsl.model.{StatusCode, StatusCodes}

trait WebException extends Exception {
  val statusCode: StatusCode
}

trait RegisterException extends WebException

object UsernameAlreadyTaken extends RegisterException {
  override val statusCode = StatusCodes.BadRequest
}

object PasswordConfirmationMismatch extends RegisterException {
  override val statusCode = StatusCodes.BadRequest
}

trait AuthenticationException extends WebException

object InvalidAccessToken extends AuthenticationException {
  override val statusCode = StatusCodes.Unauthorized
}

trait LoginException extends WebException

object InvalidCredentials extends LoginException {
  override val statusCode = StatusCodes.Forbidden
}
