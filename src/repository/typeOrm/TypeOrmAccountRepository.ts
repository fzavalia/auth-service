import AccountRepository, { Account } from "../AccountRepository";
import { getConnection } from "typeorm";
import TypeOrmAccountEntity from "./entities/TypeOrmAccountEntity";
import TypeOrmRepository from "./TypeOrmRepository";

class TypeOrmAccountRepository implements AccountRepository {
  find = (username: string) => TypeOrmRepository.find("username", username, TypeOrmAccountEntity);

  create = (account: Account) => TypeOrmRepository.create(account, TypeOrmAccountEntity);

  activate = (username: string) =>
    getConnection()
      .getRepository(TypeOrmAccountEntity)
      .update({ username }, { active: true })
      .then(() => {});
}

export default TypeOrmAccountRepository;
