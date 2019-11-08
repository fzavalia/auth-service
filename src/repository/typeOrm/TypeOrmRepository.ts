import { createConnection, ConnectionOptions, getConnection } from "typeorm";
import { NotFound } from "../inMemory/InMemoryRepository";
import "reflect-metadata";

const connectionConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: [__dirname + "/entities/*.js"],
  synchronize: true,
  logging: false,
};

abstract class TypeOrmRepository {
  static createConnection = async () => {
    try {
      await createConnection(connectionConfig);
      console.log("Connected to Database");
    } catch (e) {
      console.log("Could not connect to Database");
    }
  };
}

export default TypeOrmRepository;
