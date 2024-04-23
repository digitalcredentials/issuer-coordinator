import nock from 'nock'

const signedVcWithStatus = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context.json',
    'https://w3id.org/security/suites/ed25519-2020/v1'
  ],
  type: [
    'VerifiableCredential',
    'OpenBadgeCredential'
  ],
  id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
  name: 'Introduction to Computer Science - CS50x',
  issuer: {
    description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University',
    id: 'did:key:z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF',
    image: {
      id: 'https://certificates.cs50.io/static/success.jpg',
      type: 'Image'
    },
    name: 'Dr David Malan',
    type: 'Profile',
    url: 'https://cs.harvard.edu/malan/'
  },
  validFrom: '2020-01-01T00:00:00Z',
  credentialSubject: {
    achievement: {
      criteria: {
        narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.'
      },
      description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.',
      id: 'http://cs50.harvard.edu',
      name: 'Introduction to Computer Science - CS50x',
      type: 'Achievement'
    },
    identifier: {
      hashed: 'false',
      identityHash: 'jc.chartrand@gmail.com',
      type: 'IdentityObject'
    },
    type: 'AchievementSubject'
  },
  credentialStatus: {
    id: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1',
    statusListCredential: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB',
    statusListIndex: 1,
    statusPurpose: 'revocation',
    type: 'BitstringStatusListEntry'
  },
  proof: {
    created: '2023-08-23T12:44:15Z',
    proofPurpose: 'assertionMethod',
    proofValue: 'z5QQ12zr5JvEsKvbnEN2EYZ6punR6Pa5wMJzywGJ2dCh6SSA5oQb9hBiGADsNTbs57bopArwdBHE9kEVemMxcu1Fq',
    type: 'Ed25519Signature2020',
    verificationMethod: 'did:key:z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF#z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF'
  }
}

const unsignedVcWithoutStatus = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context.json'
  ],
  type: [
    'VerifiableCredential',
    'OpenBadgeCredential'
  ],
  id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
  name: 'Introduction to Computer Science - CS50x',
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

const unsignedVcWithStatus = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context.json'
  ],
  type: [
    'VerifiableCredential',
    'OpenBadgeCredential'
  ],
  id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
  name: 'Introduction to Computer Science - CS50x',
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
  },
  credentialStatus: {
    id: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1',
    type: 'BitstringStatusListEntry',
    statusPurpose: 'revocation',
    statusListIndex: 1,
    statusListCredential: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB'
  }
}

export default () => {
  nock('http://localhost:4008', { encodedQueryParams: true })
    .post('/credentials/status/allocate', unsignedVcWithoutStatus)
    .reply(200, unsignedVcWithStatus, [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '1470',
      'ETag',
      'W/"5be-fsduSOAlXIbTnkhg3Eo5U7uNYRQ"',
      'Date',
      'Wed, 23 Aug 2023 12:44:15 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])

  nock('http://localhost:4006', { encodedQueryParams: true })
    .post('/instance/protected_test/credentials/sign', unsignedVcWithStatus)
    .reply(200, signedVcWithStatus, [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '1810',
      'ETag',
      'W/"712-sK9DFAzLeARFlwoONQJ3mkiGzeU"',
      'Date',
      'Wed, 23 Aug 2023 12:44:15 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])

  /* nock('http://127.0.0.1:55225', { encodedQueryParams: true })
    .post('/instance/un_protected_test/credentials/issue', unsignedVcWithoutStatus)
    .reply(200, signedVcWithStatus, [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '1810',
      'ETag',
      'W/"712-fUBsd5PM46QPKrivsShMP8gvwtc"',
      'Date',
      'Tue, 22 Aug 2023 20:11:09 GMT',
      'Connection',
      'close'
  ]) */
}
