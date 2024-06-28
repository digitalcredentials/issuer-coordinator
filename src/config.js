let CONFIG
const defaultPort = 4005
const defaultTenantName = 'test'
const demoTenantName = 'testing'
const randomTenantName = 'random'
const randtomTenantToken = 'UNPROTECTED'
const defaultTenantToken = 'UNPROTECTED'
const demoTenantToken = 'UNPROTECTED'

const defaultSigningService = 'SIGNER:4006'
const defaultStatusService = 'STATUS:4008'

// we set a default tenant
// It will be overwritten by whatever value is set for default in .env
const TENANT_ACCESS_TOKENS = {}

export function initializeConfig () {
  CONFIG = parseConfig()
}

function parseTenantTokens () {
  // first add default and demo so they can be overridden by env
  TENANT_ACCESS_TOKENS[defaultTenantName] = defaultTenantToken
  TENANT_ACCESS_TOKENS[demoTenantName] = demoTenantToken
  // also add the 'random' tenant
  TENANT_ACCESS_TOKENS[randomTenantName] = randtomTenantToken
  const allEnvVars = process.env
  const tenantKeys = Object.getOwnPropertyNames(allEnvVars)
    .filter(key => key.toUpperCase().startsWith('TENANT_TOKEN_'))
  for (const key of tenantKeys) {
    const value = allEnvVars[key]
    const tenantName = key.slice(13).toLowerCase()
    TENANT_ACCESS_TOKENS[tenantName] = value
  }
}

function parseConfig () {
  const env = process.env
  const config = Object.freeze({
    enableHttpsForDev: env.ENABLE_HTTPS_FOR_DEV?.toLowerCase() === 'true',
    enableAccessLogging: env.ENABLE_ACCESS_LOGGING?.toLowerCase() === 'true',
    enableStatusService: env.ENABLE_STATUS_SERVICE?.toLowerCase() === 'true',
    signingService: env.SIGNING_SERVICE ?? defaultSigningService,
    statusService: env.STATUS_SERVICE ?? defaultStatusService,
    port: env.PORT ? parseInt(env.PORT) : defaultPort
  })
  return config
}

export function getConfig () {
  if (!CONFIG) {
    initializeConfig()
  }
  return CONFIG
}

export function resetConfig () {
  CONFIG = null
}

export function getTenantToken (tenantName) {
  if (!Object.keys(TENANT_ACCESS_TOKENS).length) {
    parseTenantTokens()
  }
  if (Object.hasOwn(TENANT_ACCESS_TOKENS, tenantName)) {
    return TENANT_ACCESS_TOKENS[tenantName]
  } else {
    return null
  }
}
