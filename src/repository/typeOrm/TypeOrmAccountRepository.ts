import AccountRepository, { Account } from "../AccountRepository";
import { getConnection } from "typeorm";
import TypeOrmAccountEntity from "./entities/TypeOrmAccountEntity";
import { NotFound } from "../inMemory/InMemoryRepository";

class TypeOrmAccountRepository implements AccountRepository {
  find = (username: string) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .findOne({ where: { username } })
      .then(account => {
        if (!account) {
          throw new NotFound();
        } else {
          return account;
        }
      });

  activate = (username: string) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .update({ username }, { active: true })
      .then(() => {});

  create = (account: Account) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .save(account)
      .then(() => {});
}

export default TypeOrmAccountRepository;
