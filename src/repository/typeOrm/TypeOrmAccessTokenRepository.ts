import AccessTokenRepository, { AccessToken } from "../AccessTokenRepository";
import TypeOrmAccessTokenEntity from "./entities/TypeOrmAccessTokenEntity";
import { getConnection } from "typeorm";
import { NotFound } from "../inMemory/InMemoryRepository";

class TypeOrmAccessTokenRepository implements AccessTokenRepository {
  find = (value: string) =>
    getConnection()
      .getRepository(TypeOrmAccessTokenEntity)
      .findOne({ where: { value } })
      .then(e => {
        if (!e) {
          throw new NotFound();
        } else {
          return e;
        }
      });

  create = (accessToken: AccessToken) =>
    getConnection()
      .getRepository(TypeOrmAccessTokenEntity)
      .save(accessToken)
      .then(() => {});

  invalidateAllForAccount = (accountUsername: string) =>
    getConnection()
      .getRepository(TypeOrmAccessTokenEntity)
      .update({ accountUsername }, { valid: false })
      .then(() => {});
}

export default TypeOrmAccessTokenRepository;
