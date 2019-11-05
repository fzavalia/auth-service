import InMemoryRepository, { NotFound } from "./InMemoryRepository";
import ActivationSecretRepository, { ActivationSecret } from "../ActivationSecretRepository";

class InMemoryActivationSecretRepository extends InMemoryRepository<ActivationSecret>
  implements ActivationSecretRepository {
  extractIndexFromElement = (e: ActivationSecret) => e.value;

  use = (value: string) =>
    new Promise<void>((resolve, reject) => {
      const e = this.elements[value];
      if (!e) {
        reject(new NotFound());
      } else {
        e.used = true;
        resolve();
      }
    });
}

export default InMemoryActivationSecretRepository;
