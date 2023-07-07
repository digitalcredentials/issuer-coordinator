import morgan from "morgan";
import logger from "../utils/logger.js";
import { getConfig } from "../config.js";

const stream = {
  write: (message) => logger.http(message),
};

const accessLogger = () => {
  const { enableAccessLogging } = getConfig();
  // change the boolean check in skip if 
  // you want to do things like only log
  // when NODE_ENV=development
  const skip = () => !enableAccessLogging;
    // morgan options. We override 'stream' to instead use winston, 
    // and override 'skip' to disable logging if disabled in env
  const options = {stream, skip}
  // This is the default morgan message format string.
    // Switch tokens as you'd like, using either Morgan pre-defined
    // tokens or your own custom tokens.
  const messageFormatString = ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  return morgan(
    messageFormatString,
    options
  );
}

export default accessLogger