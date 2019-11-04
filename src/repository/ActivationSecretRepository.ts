export interface ActivationSecret {
  value: string;
  used: boolean;
  accountUsername: string;
}

interface ActivationSecretRepository {
  create: (activationSecret: ActivationSecret) => Promise<void>;
}

export default ActivationSecretRepository;
