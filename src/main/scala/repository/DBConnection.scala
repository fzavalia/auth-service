package repository

import slick.jdbc.{H2Profile, JdbcProfile, PostgresProfile}

object DBConnection {
  lazy val postgres = new DBConnection(PostgresProfile, "postgres")
  lazy val h2       = new DBConnection(H2Profile, "h2")
}

class DBConnection(protected val profile: JdbcProfile, config: String) {
  val api = profile.api
  import api._
  val db = Database.forConfig(config)
}
