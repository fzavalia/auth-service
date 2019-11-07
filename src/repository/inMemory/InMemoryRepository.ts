import CustomError from "../../core/CustomError";

export interface InMemoryRepositoryElements<T> {
  [key: string]: T;
}

abstract class InMemoryRepository<T> {
  constructor(public readonly elements: InMemoryRepositoryElements<T> = {}) {}

  protected abstract extractIndexFromElement: (element: T) => string;

  create = (element: T) =>
    new Promise<void>((resolve, reject) => {
      const index = this.extractIndexFromElement(element);
      if (this.elements[index]) {
        reject(new AlreadyExists());
      } else {
        this.elements[index] = element;
        resolve();
      }
    });

  find = (index: string) =>
    new Promise<T>((resolve, reject) => {
      const account = this.elements[index];
      if (!account) {
        reject(new NotFound());
      } else {
        resolve(account);
      }
    });
}

export class NotFound extends CustomError {}

export class AlreadyExists extends Error {
  name = "AlreadyExists";
  message = "Element already exists";
}

export default InMemoryRepository;
