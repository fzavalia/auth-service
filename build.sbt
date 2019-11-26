name := "auth-service"

version := "0.1"

scalaVersion := "2.13.1"

// deps

libraryDependencies += "com.typesafe.akka" %% "akka-http" % "10.1.10"
libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.6.0"
libraryDependencies += "org.mindrot" % "jbcrypt" % "0.4"
libraryDependencies += "org.postgresql" % "postgresql" % "42.2.5"
libraryDependencies += "com.typesafe.slick" %% "slick" % "3.3.2"
libraryDependencies += "com.typesafe.akka" %% "akka-http-spray-json" % "10.1.10"
libraryDependencies += "com.auth0" % "java-jwt" % "3.8.3"

// test deps

libraryDependencies += "org.scalactic" %% "scalactic" % "3.0.8"
libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.8" % "test"
libraryDependencies += "com.typesafe.akka" %% "akka-stream-testkit" % "2.6.0"
libraryDependencies += "com.typesafe.akka" %% "akka-http-testkit" % "10.1.10"

// flyway db migrator

enablePlugins(FlywayPlugin)

flywayUrl := "jdbc:postgresql://localhost:5432/postgres"
flywayUser := "postgres"
flywayPassword := "postgres"
flywayLocations += "db/migration"
flywayUrl in Test := "jdbc:postgresql://localhost:5432/postgres_test"
flywayUser in Test := "postgres"
flywayPassword in Test := "postgres"