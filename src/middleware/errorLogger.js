import axios, {isAxiosError} from 'axios';
import logger from "../utils/logger.js";

const errorLogger = (error, request, response, next) => {
  const logEntry = {}
 
  if (isAxiosError(error)) {
    // an error when calling one of the microservices
    logEntry.serviceConfig = error.config
  if (error.response) {
        // The microservice responded with a status code other than 2xx
        logEntry.message = "One of the internal microservices returned an error"
        logEntry.serviceResponseError = error.response.data
        logEntry.serviceResponseStatus = error.response.status
        logEntry.serviceResponseHeaders = error.response.headers
        logEntry.serviceRequest = error.request
    } else if (error.request) {
      logEntry.message = "One of the internal microservices didn't respond."
      logEntry.serviceRequest = error.request
    } else {
      logEntry.message = `Likely an error when setting up a request to one of the internal microservices that prevented the request from being formulated: ${error.message}`
      logEntry.error = error
    }
  } else {
    // a non-axios error
    console.log(error)
  }
  const errorLogMessage = `${error.statusCode} || ${response.statusMessage} - ${request.originalUrl} - ${request.method} - ${request.ip} - ${error.message}`
  
  // note that the logEntry here is what Winston calls a 'meta' object and it simply 
  // output to the log as provided, as JSON in this case.
  logger.error(errorLogMessage, logEntry)

  next(error) // done logging, so call next middleware that deals with errors
}

export default errorLogger