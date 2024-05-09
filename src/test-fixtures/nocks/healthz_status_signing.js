import nock from 'nock'
import { defaultTenantName } from '../../config.js'
const signedVC = { '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json', 'https://w3id.org/vc/status-list/2021/v1', 'https://w3id.org/security/suites/ed25519-2020/v1', 'https://w3id.org/vc/status-list/2021/v1'], id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1', type: ['VerifiableCredential', 'OpenBadgeCredential'], issuer: { id: 'did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy', type: 'Profile', name: 'Dr David Malan', description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University', url: 'https://cs.harvard.edu/malan/', image: { id: 'https://certificates.cs50.io/static/success.jpg', type: 'Image' } }, issuanceDate: '2020-01-01T00:00:00Z', name: 'Introduction to Computer Science - CS50x', credentialSubject: { type: 'AchievementSubject', identifier: { type: 'IdentityObject', identityHash: 'jc.chartrand@gmail.com', hashed: 'false' }, achievement: { id: 'http://cs50.harvard.edu', type: 'Achievement', criteria: { narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.' }, description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.', name: 'Introduction to Computer Science - CS50x' } }, credentialStatus: { id: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1', type: 'StatusList2021Entry', statusPurpose: 'revocation', statusListIndex: 1, statusListCredential: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB' }, proof: { type: 'Ed25519Signature2020', created: '2023-08-22T20:11:09Z', verificationMethod: 'did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy#z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy', proofPurpose: 'assertionMethod', proofValue: 'z51uH32BFx2mNntaGE55MeHwespoAjetxDkTHBMKtbgGDdc5XiGSTaEGrRgANtT8DV5a6rTNnhT8FKRD4oVnhnxtG' } }

export default () => {
  nock('http://localhost:4006', { encodedQueryParams: true })
    .post(`/instance/${defaultTenantName}/credentials/sign`, { '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json', 'https://w3id.org/vc/status-list/2021/v1', 'https://w3id.org/security/suites/ed25519-2020/v1', 'https://w3id.org/vc/status-list/2021/v1'], id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1', type: ['VerifiableCredential', 'OpenBadgeCredential'], issuer: { id: 'did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC', type: 'Profile', name: 'Dr David Malan', description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University', url: 'https://cs.harvard.edu/malan/', image: { id: 'https://certificates.cs50.io/static/success.jpg', type: 'Image' } }, issuanceDate: '2020-01-01T00:00:00Z', name: 'Introduction to Computer Science - CS50x', credentialSubject: { type: 'AchievementSubject', identifier: { type: 'IdentityObject', identityHash: 'jc.chartrand@gmail.com', hashed: 'false' }, achievement: { id: 'http://cs50.harvard.edu', type: 'Achievement', criteria: { narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.' }, description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.', name: 'Introduction to Computer Science - CS50x' } }, credentialStatus: { id: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1', type: 'StatusList2021Entry', statusPurpose: 'revocation', statusListIndex: 1, statusListCredential: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB' } })
    .reply(200, signedVC, [
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
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])
  nock('http://localhost:4008', { encodedQueryParams: true })
    .post('/credentials/status/allocate', { '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json', 'https://w3id.org/vc/status-list/2021/v1', 'https://w3id.org/security/suites/ed25519-2020/v1'], id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1', type: ['VerifiableCredential', 'OpenBadgeCredential'], issuer: { id: 'did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC', type: 'Profile', name: 'Dr David Malan', description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University', url: 'https://cs.harvard.edu/malan/', image: { id: 'https://certificates.cs50.io/static/success.jpg', type: 'Image' } }, issuanceDate: '2020-01-01T00:00:00Z', name: 'Introduction to Computer Science - CS50x', credentialSubject: { type: 'AchievementSubject', identifier: { type: 'IdentityObject', identityHash: 'jc.chartrand@gmail.com', hashed: 'false' }, achievement: { id: 'http://cs50.harvard.edu', type: 'Achievement', criteria: { narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.' }, description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.', name: 'Introduction to Computer Science - CS50x' } } })
    .reply(200, { '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json', 'https://w3id.org/vc/status-list/2021/v1', 'https://w3id.org/security/suites/ed25519-2020/v1', 'https://w3id.org/vc/status-list/2021/v1'], id: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1', type: ['VerifiableCredential', 'OpenBadgeCredential'], issuer: { id: 'did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC', type: 'Profile', name: 'Dr David Malan', description: 'Gordon McKay Professor of the Practice of Computer Science, Harvard University', url: 'https://cs.harvard.edu/malan/', image: { id: 'https://certificates.cs50.io/static/success.jpg', type: 'Image' } }, issuanceDate: '2020-01-01T00:00:00Z', name: 'Introduction to Computer Science - CS50x', credentialSubject: { type: 'AchievementSubject', identifier: { type: 'IdentityObject', identityHash: 'jc.chartrand@gmail.com', hashed: 'false' }, achievement: { id: 'http://cs50.harvard.edu', type: 'Achievement', criteria: { narrative: 'Completion of CS50X, including ten problem sets, ten labs, and one final project.' }, description: 'CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.', name: 'Introduction to Computer Science - CS50x' } }, credentialStatus: { id: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1', type: 'StatusList2021Entry', statusPurpose: 'revocation', statusListIndex: 1, statusListCredential: 'https://jchartrand.github.io/status-test-three/DKSPRCX9WB' } }, [
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
      'Tue, 22 Aug 2023 20:11:09 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])

/* nock('http://127.0.0.1:55225', {"encodedQueryParams":true})
  .post('/instance/un_protected_test/credentials/issue', {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}}})
  .reply(200, {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"},"proof":{"type":"Ed25519Signature2020","created":"2023-08-22T20:11:09Z","verificationMethod":"did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy#z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy","proofPurpose":"assertionMethod","proofValue":"z51uH32BFx2mNntaGE55MeHwespoAjetxDkTHBMKtbgGDdc5XiGSTaEGrRgANtT8DV5a6rTNnhT8FKRD4oVnhnxtG"}}, [
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
]); */
}

/* export default () => {nock('http://localhost:4006', {"encodedQueryParams":true})
  .post('/instance/testing3/credentials/sign', {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"}})
  .reply(200, {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6Mkuoj16AELhDkUk8tvTLA6e6yenGXSNoZ5urtprJoqhuww","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"},"proof":{"type":"Ed25519Signature2020","created":"2023-08-03T17:27:29Z","verificationMethod":"did:key:z6Mkuoj16AELhDkUk8tvTLA6e6yenGXSNoZ5urtprJoqhuww#z6Mkuoj16AELhDkUk8tvTLA6e6yenGXSNoZ5urtprJoqhuww","proofPurpose":"assertionMethod","proofValue":"z53EF47PshAVsVtRBTBBv8A1vJvWptWn5p4QupVnAeZYWZJnTGAcABmAVYRZ4CR1xAjWyPrg7ktXerJ9PfUgSLfTh"}}, [
  'X-Powered-By',
  'Express',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '1810',
  'ETag',
  'W/"712-0nL+TtiN38hiHrSNvQHR9Iqira4"',
  'Date',
  'Thu, 03 Aug 2023 17:27:29 GMT',
  'Connection',
  'keep-alive',
  'Keep-Alive',
  'timeout=5'
])} */
