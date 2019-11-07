import { InMemoryRepositoryElements } from "../repository/inMemory/InMemoryRepository";
import CustomError from "../core/CustomError";

export const makeMergeRepositoryDataFunction = <T>(original: InMemoryRepositoryElements<T>) => (merge?: any) =>
  Object.assign(original, merge) as InMemoryRepositoryElements<T>;

export const validateError = (catchedError: any, customError: CustomError) => {
  const err: Error = catchedError;
  if (err.name !== customError.name) {
    throw new Error();
  }
};
