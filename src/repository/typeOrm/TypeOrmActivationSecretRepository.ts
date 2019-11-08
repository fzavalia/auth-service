import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";
import TypeOrmActivationSecretEntity from "./entities/TypeOrmActivationSecretEntity";
import { NotFound } from "../inMemory/InMemoryRepository";
import { getConnection } from "typeorm";

class TypeOrmActivationSecretRepository implements ActivationSecretRepository {
  find = (value: string) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .findOne({ where: { value } })
      .then(e => {
        if (!e) {
          throw new NotFound();
        } else {
          return e;
        }
      });

  create = (activationSecret: ActivationSecret) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .save(activationSecret)
      .then(() => {});

  use = (value: string) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .update({ value }, { used: true })
      .then(() => {});
}

export default TypeOrmActivationSecretRepository;
