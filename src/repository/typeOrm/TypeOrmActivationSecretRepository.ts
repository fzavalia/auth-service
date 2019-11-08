import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";
import { getConnection } from "typeorm";
import TypeOrmActivationSecretEntity from "./entities/TypeOrmActivationSecretEntity";
import { NotFound } from "../inMemory/InMemoryRepository";

class TypeOrmActivationSecretRepository implements ActivationSecretRepository {
  find = (value: string) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .findOne({ where: { value } })
      .then(activationSecret => {
        if (!activationSecret) {
          throw new NotFound();
        } else {
          return activationSecret;
        }
      });

  use = (value: string) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .update({ value }, { used: true })
      .then(() => {});

  create = (activationSecret: ActivationSecret) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .save(activationSecret)
      .then(() => {});
}

export default TypeOrmActivationSecretRepository;
