import nock from 'nock';
const signedVC = {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"},"proof":{"type":"Ed25519Signature2020","created":"2023-08-23T12:44:15Z","verificationMethod":"did:key:z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF#z6MkrDLfZytHX5acEFds6wAYJbvMbT9UuhKhub4qaguDESCF","proofPurpose":"assertionMethod","proofValue":"z5QQ12zr5JvEsKvbnEN2EYZ6punR6Pa5wMJzywGJ2dCh6SSA5oQb9hBiGADsNTbs57bopArwdBHE9kEVemMxcu1Fq"}}

export default () => {
    nock('http://localhost:4008', {"encodedQueryParams":true})
    .post('/credentials/status/allocate', {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}}})
    .reply(200, {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"}}, [
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
  ]);

  nock('http://localhost:4006', {"encodedQueryParams":true})
  .post('/instance/protected_test/credentials/sign', {"@context":["https://www.w3.org/2018/credentials/v1","https://purl.imsglobal.org/spec/ob/v3p0/context.json","https://w3id.org/vc/status-list/2021/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/vc/status-list/2021/v1"],"id":"urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1","type":["VerifiableCredential","OpenBadgeCredential"],"issuer":{"id":"did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC","type":"Profile","name":"Dr David Malan","description":"Gordon McKay Professor of the Practice of Computer Science, Harvard University","url":"https://cs.harvard.edu/malan/","image":{"id":"https://certificates.cs50.io/static/success.jpg","type":"Image"}},"issuanceDate":"2020-01-01T00:00:00Z","name":"Introduction to Computer Science - CS50x","credentialSubject":{"type":"AchievementSubject","identifier":{"type":"IdentityObject","identityHash":"jc.chartrand@gmail.com","hashed":"false"},"achievement":{"id":"http://cs50.harvard.edu","type":"Achievement","criteria":{"narrative":"Completion of CS50X, including ten problem sets, ten labs, and one final project."},"description":"CS50 congratulates <STUDENT NAME HERE> on completion of CS50x.","name":"Introduction to Computer Science - CS50x"}},"credentialStatus":{"id":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB#1","type":"StatusList2021Entry","statusPurpose":"revocation","statusListIndex":1,"statusListCredential":"https://jchartrand.github.io/status-test-three/DKSPRCX9WB"}})
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
  'W/"712-sK9DFAzLeARFlwoONQJ3mkiGzeU"',
  'Date',
  'Wed, 23 Aug 2023 12:44:15 GMT',
  'Connection',
  'keep-alive',
  'Keep-Alive',
  'timeout=5'
]);

}
