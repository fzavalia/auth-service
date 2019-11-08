import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";
import TypeOrmActivationSecretEntity from "./entities/TypeOrmActivationSecretEntity";
import TypeOrmRepository from "./TypeOrmRepository";

class TypeOrmActivationSecretRepository implements ActivationSecretRepository {
  find = (value: string) => TypeOrmRepository.find("value", value, TypeOrmActivationSecretEntity);

  create = (activationSecret: ActivationSecret) =>
    TypeOrmRepository.create(activationSecret, TypeOrmActivationSecretEntity);

  use = (value: string) => TypeOrmRepository.update("value", value, { used: true }, TypeOrmActivationSecretEntity);
}

export default TypeOrmActivationSecretRepository;
