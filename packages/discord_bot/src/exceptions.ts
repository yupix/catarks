export class OutOfRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OutOfRangeError";
  }
}
