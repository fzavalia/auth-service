abstract class CustomError extends Error {
  name = this.constructor.name;
}

export default CustomError;
