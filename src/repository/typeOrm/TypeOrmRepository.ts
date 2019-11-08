import { createConnection } from "typeorm";
import "reflect-metadata";

abstract class TypeOrmRepository {
  static createConnection = () =>
    createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [__dirname + "/entities/*.js"],
      synchronize: true,
      logging: false,
    })
      .then(() => console.log("Connected to Database"))
      .catch(() => console.log("Could not connect to Database"));
}

export default TypeOrmRepository;
