import { getTenantToken } from "./config.js";

function AuthorizationException(code, message) {
    this.code = code
    this.message = message
}

export default async function verifyAuthHeader(authHeader, tenantName) {

    const tenantToken = getTenantToken(tenantName)
    if (!tenantToken) {
        throw new AuthorizationException(404, "Tenant does not exist.")
    }

    if (tenantToken === 'UNPROTECTED') return true  // no tenant token has been set so no auth required

    if (!authHeader) {
        throw new AuthorizationException(401, 'No authorization header was provided.')
    }
    const [scheme, accessToken] = authHeader.split(' ');

    if (!(scheme === 'Bearer')) {
        throw new AuthorizationException(401, 'Access header must be of type Bearer.')
    }

    if (tenantToken !== accessToken) {
        throw new AuthorizationException(403, 'You provided a token that is not authorized or may have changed.')
    }

    return true

}