package web

case class RegisterRequest(username: String, password: String, passwordConfirmation: String)

case class AuthenticateRequest(accessToken: String)

case class LoginRequest(username: String, password: String)

case class LoginResponse(accessToken: String)
