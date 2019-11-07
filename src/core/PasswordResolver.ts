import bcrypt from "bcrypt";

interface PasswordResolver {
  encrypt: (password: string) => string;
  compare: (password: string, encrypted: string) => boolean;
}

export class BcryptPasswordResolver implements PasswordResolver {
  encrypt = (password: string) => bcrypt.hashSync(password, 10);
  compare = (password: string, encrypted: string) => bcrypt.compareSync(password, encrypted);
}

export class StubPasswordResolver implements PasswordResolver {
  encrypt = (password: string) => password;
  compare = (password: string, encrypted: string) => password === encrypted;
}

export default PasswordResolver;
