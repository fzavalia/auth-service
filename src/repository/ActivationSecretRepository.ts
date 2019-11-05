export interface ActivationSecret {
  value: string;
  used: boolean;
  accountUsername: string;
}

interface ActivationSecretRepository {
  use: (value: string) => Promise<void>;
  find: (value: string) => Promise<ActivationSecret>;
  create: (activationSecret: ActivationSecret) => Promise<void>;
}

export default ActivationSecretRepository;