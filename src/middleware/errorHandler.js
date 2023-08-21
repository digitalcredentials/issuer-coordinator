import axios, { isAxiosError } from 'axios';
function handleAxiosError(error) {
    const errorResponse = { serviceConfig: error.config, code: 500 }
    if (error.response) {
        // The microservice responded with a status code other than 2xx
        errorResponse.message = "One of the internal microservices returned an error"
        errorResponse.serviceResponseError = error.response.data
        errorResponse.serviceResponseStatus = error.response.status
        errorResponse.serviceResponseHeaders = error.response.headers
    } else if (error.request) {
        errorResponse.message = "One of the internal microservices didn't respond."
        errorResponse.serviceRequest = error.request
    } else {
        errorResponse.message = `Likely an error when setting up the request that prevented the request from being formulated: ${error.message}`
        errorResponse.error = error
    }
    return errorResponse
}

const errorHandler = (error, request, response, next) => {
    let errorResponse
    if (isAxiosError(error)) {
        errorResponse = handleAxiosError(error);
    } else {
        // this is an error returned for something internal, 
        // like the check for an access token, 
        // or a missing argument on a call
        errorResponse = error
    }
    response.header("Content-Type", 'application/json')
    response.status(errorResponse.code).json(errorResponse)
}

export default errorHandler