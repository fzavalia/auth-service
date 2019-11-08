import AccountRepository, { Account } from "../AccountRepository";
import TypeOrmAccountEntity from "./entities/TypeOrmAccountEntity";
import TypeOrmRepository from "./TypeOrmRepository";

class TypeOrmAccountRepository implements AccountRepository {
  find = (username: string) => TypeOrmRepository.find("username", username, TypeOrmAccountEntity);

  create = (account: Account) => TypeOrmRepository.create(account, TypeOrmAccountEntity);

  activate = (username: string) =>
    TypeOrmRepository.update("username", username, { active: true }, TypeOrmAccountEntity);
}

export default TypeOrmAccountRepository;
