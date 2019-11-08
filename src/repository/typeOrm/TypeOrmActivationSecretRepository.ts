import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";
import { getConnection } from "typeorm";
import TypeOrmActivationSecretEntity from "./entities/TypeOrmActivationSecretEntity";
import TypeOrmRepository from "./TypeOrmRepository";

class TypeOrmActivationSecretRepository implements ActivationSecretRepository {
  find = (value: string) => TypeOrmRepository.find("value", value, TypeOrmActivationSecretEntity);

  create = (activationSecret: ActivationSecret) =>
    TypeOrmRepository.create(activationSecret, TypeOrmActivationSecretEntity);

  use = (value: string) =>
    getConnection()
      .getRepository(TypeOrmActivationSecretEntity)
      .update({ value }, { used: true })
      .then(() => {});
}

export default TypeOrmActivationSecretRepository;
