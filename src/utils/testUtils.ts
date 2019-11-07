import { InMemoryRepositoryElements } from "../repository/inMemory/InMemoryRepository";
import CustomError from "../core/CustomError";
import _ from "lodash";

export const makeMergeRepositoryDataFunction = <T>(original: InMemoryRepositoryElements<T>) => (merge?: any) =>
  Object.assign(_.cloneDeep(original), merge) as InMemoryRepositoryElements<T>;

export const validateError = <T extends CustomError>(catchedError: any, customError: CustomError) => {
  const err: T = catchedError;
  if (err.name !== customError.name) {
    throw new Error();
  }
};
