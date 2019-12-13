package repository

object DBConnection {
  val api = slick.jdbc.PostgresProfile.api
  import api._
  val db = Database.forConfig("postgres")
}
