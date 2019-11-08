import AccountRepository, { Account } from "../AccountRepository";
import TypeOrmAccountEntity from "./entities/TypeOrmAccountEntity";
import { NotFound } from "../inMemory/InMemoryRepository";
import { getConnection } from "typeorm";

class TypeOrmAccountRepository implements AccountRepository {
  find = (username: string) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .findOne({ where: { username } })
      .then(e => {
        if (!e) {
          throw new NotFound();
        } else {
          return e;
        }
      });

  create = (account: Account) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .save(account)
      .then(() => {});

  activate = (username: string) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .update({ username }, { active: true })
      .then(() => {});
}

export default TypeOrmAccountRepository;
