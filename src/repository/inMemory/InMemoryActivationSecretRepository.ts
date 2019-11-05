import InMemoryRepository from "./InMemoryRepository";
import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";

class InMemoryActivationSecretRepository extends InMemoryRepository<ActivationSecret>
  implements ActivationSecretRepository {
  extractIndexFromElement = (e: ActivationSecret) => e.value;
}

export default InMemoryActivationSecretRepository;
