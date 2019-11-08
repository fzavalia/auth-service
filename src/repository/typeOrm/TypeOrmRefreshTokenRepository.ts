import { getConnection } from "typeorm";
import { NotFound } from "../inMemory/InMemoryRepository";
import RefreshTokenRepository, { RefreshToken } from "../RefreshTokenRepository";
import TypeOrmRefreshTokenEntity from "./entities/TypeOrmRefreshTokenEntity";

class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  find = (value: string) =>
    getConnection()
      .getRepository(TypeOrmRefreshTokenEntity)
      .findOne({ where: { value } })
      .then(e => {
        if (!e) {
          throw new NotFound();
        } else {
          return e;
        }
      });

  create = (refreshToken: RefreshToken) =>
    getConnection()
      .getRepository(TypeOrmRefreshTokenEntity)
      .save(refreshToken)
      .then(() => {});

  invalidateAllForAccount = (accountUsername: string) =>
    getConnection()
      .getRepository(TypeOrmRefreshTokenEntity)
      .update({ accountUsername }, { valid: false })
      .then(() => {});
}

export default TypeOrmRefreshTokenRepository;
