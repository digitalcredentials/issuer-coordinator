import nock from 'nock'

const theList = `{
    "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "https://sincere-bonefish-currently.ngrok-free.app/slAwJe6GGR6mBojlGW5U",
    "type": [
        "VerifiableCredential",
        "BitstringStatusListCredential"
    ],
    "credentialSubject": {
        "id": "https://sincere-bonefish-currently.ngrok-free.app/slAwJe6GGR6mBojlGW5U#list",
        "type": "BitstringStatusList",
        "encodedList": "uH4sIAAAAAAAAA-3BIQEAAAACICf4f60vTEADAAAAAAAAAAAAAADwN_wEBkHUMAAA",
        "statusPurpose": "revocation"
    },
    "issuer": "did:key:z6Mkg165pEHaUPxkY4NxToor7suxzawEmdT1DEWq3e1Nr2VR",
    "validFrom": "2024-09-03T15:24:19.685Z",
    "proof": {
        "type": "Ed25519Signature2020",
        "created": "2024-09-03T15:24:19Z",
        "verificationMethod": "did:key:z6Mkg165pEHaUPxkY4NxToor7suxzawEmdT1DEWq3e1Nr2VR#z6Mkg165pEHaUPxkY4NxToor7suxzawEmdT1DEWq3e1Nr2VR",
        "proofPurpose": "assertionMethod",
        "proofValue": "z4y3GawinQg1aCqbYqZM8dmDpbmtFa3kE6tFefdXvLi5iby25dvmVwLNZrfcFPyhpshrhCWB76pdSZchVve3K1Znr"
    }
}`

export default () => {
  nock('http://localhost:4008')
    .get('/slAwJe6GGR6mBojlGW5U')
    .reply(200, theList)
}
