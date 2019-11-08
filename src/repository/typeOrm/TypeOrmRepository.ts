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

  static find = <T>(key: string, value: string, entity: new () => T) =>
    getConnection()
      .getRepository(entity)
      .findOne({ where: { [key]: value } })
      .then(e => {
        if (!e) {
          throw new NotFound();
        } else {
          return e;
        }
      });

  static create = <T>(e: T, entity: new () => T) =>
    getConnection()
      .getRepository(entity)
      .save(e)
      .then(() => {});
}

export default TypeOrmRepository;
