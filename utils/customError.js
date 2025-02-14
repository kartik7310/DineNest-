export class customError extends Error{
  constructor(message,status=400){
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}