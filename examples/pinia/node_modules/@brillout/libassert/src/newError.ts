import { cleanStackTrace } from "./cleanStackTrace";

export { newError };

function newError(
  errorMessage: string,
  numberOfStackTraceLinesToRemove: number
) {
  let err;
  {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    err = new Error(errorMessage);
    Error.stackTraceLimit = stackTraceLimit__original;
  }

  cleanStackTrace(err, numberOfStackTraceLinesToRemove);

  return err;
}
