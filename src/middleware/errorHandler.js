import { isAxiosError } from 'axios'
function handleAxiosError (error) {
  const errorResponse = { code: 500 }
  if (error.response) {
    // The microservice responded with a status code other than 2xx
    errorResponse.message = 'One of the internal microservices returned an error'
    errorResponse.serviceResponseError = error.response.data
    errorResponse.serviceResponseStatus = error.response.status
    errorResponse.serviceResponseHeaders = error.response.headers
  } else if (error.request) {
    errorResponse.message = "One of the internal microservices didn't respond. Hit / to check heartbeats."
    // errorResponse.serviceRequest = error.request
  } else {
    errorResponse.message = `Likely an error when setting up the request that prevented the request from being formulated: ${error.message}`
    errorResponse.error = error
  }
  return errorResponse
}

const errorHandler = (error, request, response, next) => {
  let errorResponse
  if (isAxiosError(error)) {
    errorResponse = handleAxiosError(error)
  } else {
    // otherwise, this is an error that we've thrown ourselves,
    // or it is some other error, so pass it along
    errorResponse = error
  }
  response.header('Content-Type', 'application/json')
  response.status(errorResponse.code).json(errorResponse)
}

export default errorHandler
