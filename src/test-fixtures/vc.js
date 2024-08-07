const unsignedVC = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context.json'
  ],
  id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
  type: [
    'VerifiableCredential',
    'OpenBadgeCredential'
  ],
  issuer: {
    id: 'did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC',
    type: 'Profile',
    name: 'Dr David Malan',
    description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University',
    url: 'https://cs.harvard.edu/malan/',
    image: {
      id: 'https://certificates.cs50.io/static/success.jpg',
      type: 'Image'
    }
  },
  validFrom: '2020-01-01T00:00:00Z',
  name: 'Introduction to Computer Science - CS50x',
  credentialSubject: {
    type: 'AchievementSubject',
    identifier: {
      type: 'IdentityObject',
      identityHash: 'jc.chartrand@gmail.com',
      hashed: 'false'
    },
    achievement: {
      id: 'http://cs50.harvard.edu',
      type: 'Achievement',
      criteria: {
        narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.'
      },
      description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.',
      name: 'Introduction to Computer Science - CS50x'
    }
  }
}

const credentialStatus = [
  {
    id: 'https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4#2',
    type: 'BitstringStatusListEntry',
    statusPurpose: 'revocation',
    statusListIndex: 2,
    statusListCredential: 'https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4'
  },
  {
    id: 'https://digitalcredentials.github.io/credential-status-jc-test/DKSPRCX9WB#5',
    type: 'BitstringStatusListEntry',
    statusPurpose: 'suspension',
    statusListIndex: 5,
    statusListCredential: 'https://digitalcredentials.github.io/credential-status-jc-test/DKSPRCX9WB'
  }
]

const getUnsignedVC = () => JSON.parse(JSON.stringify(unsignedVC))
const getUnsignedVCWithoutSuiteContext = () => {
  const vcCopy = JSON.parse(JSON.stringify(unsignedVC))
  const index = vcCopy['@context'].indexOf(suiteContext)
  if (index > -1) {
    vcCopy['@context'].splice(index, 1)
  }
  return vcCopy
}
const getCredentialStatus = () => JSON.parse(JSON.stringify(credentialStatus))

const getUnsignedVCWithStatus = () => {
  const unsignedVCWithStatus = getUnsignedVC()
  unsignedVCWithStatus.credentialStatus = getCredentialStatus()
  return unsignedVCWithStatus
}
const suiteContext = 'https://w3id.org/security/suites/ed25519-2020/v1'

export {
  getUnsignedVC,
  getUnsignedVCWithoutSuiteContext,
  getCredentialStatus,
  getUnsignedVCWithStatus
}
