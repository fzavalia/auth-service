import ActivationSecretRepository from "../repository/ActivationSecretRepository";
import AccountRepository from "../repository/AccountRepository";

class Activate {
  constructor(
    private readonly activationSecretRepository: ActivationSecretRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  exec: (secret: string) => Promise<void> = async secret => {
    const activationSecret = await this.activationSecretRepository.find(secret);
    await this.activationSecretRepository.use(secret);
    await this.accountRepository.activate(activationSecret.accountUsername);
  };
}

export default Activate;
