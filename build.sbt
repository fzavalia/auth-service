name := "auth-service"

version := "0.1"

scalaVersion := "2.13.1"

// deps

libraryDependencies += "com.typesafe.akka" %% "akka-http"            % "10.1.10"
libraryDependencies += "com.typesafe.akka" %% "akka-stream"          % "2.6.0"
libraryDependencies += "org.mindrot"       % "jbcrypt"               % "0.4"
libraryDependencies += "com.typesafe.akka" %% "akka-http-spray-json" % "10.1.10"

// deps - slick

libraryDependencies += "org.postgresql"     % "postgresql"      % "42.2.5"
libraryDependencies += "com.typesafe.slick" %% "slick"          % "3.3.2"
libraryDependencies += "com.typesafe.slick" %% "slick-hikaricp" % "3.3.2"

// test deps

libraryDependencies += "org.scalactic"     %% "scalactic"           % "3.0.8"
libraryDependencies += "org.scalatest"     %% "scalatest"           % "3.0.8" % "test"
libraryDependencies += "com.typesafe.akka" %% "akka-stream-testkit" % "2.6.0"
libraryDependencies += "com.typesafe.akka" %% "akka-http-testkit"   % "10.1.10"

// flyway db migrator

enablePlugins(FlywayPlugin)

flywayLocations += "db/migration"

flywayUrl := "jdbc:postgresql://localhost:5432/postgres"
flywayUser := "postgres"
flywayPassword := "postgres"

flywayUrl in Test := "jdbc:postgresql://localhost:5433/postgres"
flywayUser in Test := "postgres"
flywayPassword in Test := "postgres"
