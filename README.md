# Digital Credentials Consortium Verifiable Credentials Issuer

[![Build status](https://img.shields.io/github/actions/workflow/status/digitalcredentials/issuer-coordinator/main.yml?branch=main)](https://github.com/digitalcredentials/issuer-coordinator/actions?query=workflow%3A%22Node.js+CI%22)

An express app that signs Verifiable Credentials. The app coordinates calls to a signing service and a status service, each themselves running as express apps, with all three apps running together within Docker Compose.

![services-flow](./images/services-flow.jpg)

Try it in five minutes or less with our [Quick Start](#quick-start).

Note that you needn't clone this repository to use the issuer - you can simply run the provided docker-compose file, which pulls images from DockerHub. 

## Table of Contents

- [Summary](#summary)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Change Default Signing Key](#set-signing-key)
    - [Generate a New Key](#generate-a-new-key)
	- [Set Signing Key](#set-signing-key)
  - [Add Tenants](#add-tenants)
    - [Add a Tenant Seed](#add-a-tenant-seed)
	- [Declare Tenant Endpoints](#declare-tenant-endpoints)
    - [Tenants Example](#tenants-example)
  - [Enable Revocation](#enable-revocation)
  - [DID Registries](#did-registries)
  - [did:key](#didkey)
  - [did:web](#didweb)
  - [Revoking](#revoking)
- [Usage](#usage)
  - [Issuing](#issuing)
  - [Revoking](#revoking)
- [Learner Credential Wallet](#learner-credential-wallet)
- [Development](#development)
  - [Testing](#testing)
- [Contribute](#contribute)
- [License](#license)

## Summary

Use this server to issue [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) with a [revocation status](https://www.w3.org/TR/vc-status-list/) that can later be updated to revoke the credential.

Implements two [VC-API](https://w3c-ccg.github.io/vc-api/) http endpoints:

 * [POST /credentials/issue](https://w3c-ccg.github.io/vc-api/#issue-credential)
 * [POST /credentials/status](https://w3c-ccg.github.io/vc-api/#update-status)

We've tried hard to make this simple to install and maintain, and correspondingly easy to evaluate and understand as you consider whether digital credentials are useful for your project, and whether this issuer would work for you. 

In particular, we've separated the typical parts of an issuer into smaller self-contained apps that are consequently easier to understand and evaluate, and to *wire* together to add functionality. The apps are wired together in a simple docker compose network that pulls images from DockerHub.

We've made installation a gradual process starting with a simple version that can be up and running in about three minutes, and then progressing with configuration as needed.

## Quick Start

These four step should take less than five minutes in total:

### Install Docker

Docker have made this very easy, with [installers for Windows, Mac, and Linux](https://docs.docker.com/engine/install/) that make it as easy to install as any other application.

### Make a Docker Compose file

Create a file called docker-compose.yml and add the following

```
version: '3.5'
services:
  coordinator:
    image: digitalcredentials/issuer-coordinator
    ports:
      - "4005:4005"
  signer:
    image: digitalcredentials/signing-service
```

### Run it

From the terminal in the same directory that contains your docker-compose.yml file:

```docker compose up```

### Issue

Issue credentials, by posting to the endpoint as described in the [Usage section](#usage)

WARNING: DO NOT USE THIS TO ISSUE `REAL` CREDENTIALS UNTIL YOU'VE [SET YOUR OWN SIGNING KEY](#signing-key)

NOTE: Revocation is not enabled in the Quick Start. You've got to setup a couple of thigs to [ENABLE REVOCATION](#create-github-repositories).

## Configuration

There are a few things you'll want to configure, in particular setting your own signing keys (so that only you can sign your credentials). Other options include enabling revocation, or allowing for 'multi-tenant' signing, which you might use, for example, to sign credentials for different courses with a different key.

The app is configured with three .env files:

* [.coordinator.env](./.coordinator.env)
* [.signing-service.env](./.signer.env)
* [.status-service.env](./.signer.env)

If you've used the QuickStart docker-compose.yml, then you'll have to point it at these files. We've pre-configured this [docker-compose.yml](./docker-compose.yml), though, so you can just use that.

### Change Default Signing key

The issuer is pre-configured with a default signing key that can only be used for testing and evaluation. Any credentials signed with this key are meaningless because anyone else can use it to sign credentials, and so could create fake copies of your credentials which would appear to be properly signed. There would be no way to know that it was fake.

TODO: may want to by default auto-generate an ephemeral key on startup, that only lasts for the life of the process. Upside is that it wouldn't validate in any registry and so would force people to generate and set their own key. Downside is that credentials wouldn't validate, and so wouldn't demonstrate that functionality, but on the hand, would demonstrate failed verification.

#### Generate a new key

To issue your own credentials you must generate your own signing key and keep it private.  We've tried to make that a little easier by providing a convenience endpoint in the issuer that you can use to generate a brand new key.  You can hit the endpoint with the following CURL command (in a terminal):

`curl --location 'http://localhost:4007/seedgen'`

This will return a json document with:

- a seed
- the corresponding DID
- the corresponding DID Document

The returned result will look something like this:

```
{
	"seed": "z1AjQUBZCNoiyPUC8zbbF29gLdZtHRqT6yPdFGtqJa5VfQ6",
	"did": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4",
	"didDocument": {
		"@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1", "https://w3id.org/security/suites/x25519-2020/v1"],
		"id": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4",
		"verificationMethod": [{
			"id": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4",
			"type": "Ed25519VerificationKey2020",
			"controller": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4",
			"publicKeyMultibase": "z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4"
		}],
		"authentication": ["did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4"],
		"assertionMethod": ["did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4"],
		"capabilityDelegation": ["did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4"],
		"capabilityInvocation": ["did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4"],
		"keyAgreement": [{
			"id": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4#z6LSnYW9e4Q4EXTvdjDhKyr2D1ghBfSLa5dJGBfzjG6hyPEt",
			"type": "X25519KeyAgreementKey2020",
			"controller": "did:key:z6MkweTn1XVAiFfHjiH48oLknjNqRs43ayzguc8G8VbEAVm4",
			"publicKeyMultibase": "z6LSnYW9e4Q4EXTvdjDhKyr2D1ghBfSLa5dJGBfzjG6hyPEt"
		}]
	}
}
```

Now that you've got your key you'll want to set it...

#### Set Signing Key

Signing keys are set as 'seeds' in the [.signer.env](.signer.env) file for the signer-service. 

The default signing key is set as:

`TENANT_SEED_DEFAULT=generate`

The 'generate' value means that a new random seed is generated everytime the app starts. The seed only exists for the life of the process. This is fine for experimentation, but to issue credentials whose issuer can be verified you need a permanent key that you can add to a trusted registry. The registry certifies that the key really does belong to the claimed issuer. A verifier checks the registry when verifying a credential.

So, take the value of the 'seed' property for the key you generated, which from the example above would be:

`"seed": "z1AjQUBZCNoiyPUC8zbbF29gLdZtHRqT6yPdFGtqJa5VfQ6"`

and replace the 'generate' value for the TENANT_SEED_DEFAULT with your new seed value, like so:

`TENANT_SEED_DEFAULT=z1AjQUBZCNoiyPUC8zbbF29gLdZtHRqT6yPdFGtqJa5VfQ6`

Once your key is set, you can test it as described in [Usage](#usage).

Note that this sets a key for the default tenant, but you can set up as many tenants as you like as explained in the [Add Tenants](#tenants) section. 

### Add Tenants

You might want to allow more than one signing key/DID to be used with the issuer. For example, you might want to sign university/college degree diplomas with a DID that is only used by the registrar, but also allow certificates for individual courses to be signed by by different DIDS that are owned by the faculty or department or even the instructors that teach the courses.

We're calling these differents signing authorities 'tenants'.  

#### Add a Tenant Seed

Adding a tenant is simple. Just add another `TENANT_SEED_{TENANT_NAME}` environment variable in [.signer.env](.signer.env). The value of the variable should be a seed. Generate a new seed as explained in [Generate a new key](#generate-a-new-key), and set it as explained for the default tenant in [Set Signing Key](#set-signing-key).

#### Declare Tenant Endpoints

Tenant endpoints must be add to [.coordinator.env](.coordinator.env) and given a value of either 'UNPROTECTED' or some arbitrary value of your choosing (like a UUID). If you set a value other than UNPROTECTED then that value must be included as a Bearer token in the Authorization header of any calls to the endpoint.

We also suggest using IP filtering on your endpoints to only allow set IPs to access the issuer.  Set filtering in your nginx or similar.

Add a `TENANT_TOKEN_{TENANT_NAME}` environment variable to the [.coordinator.env](.coordinator.env) file.

#### Tenants Example

To set up two tenants, one for degrees and one for completion of the Econ101 course, and you wanted to secure the degrees tenant but not the Econ101, then you could create the tenants by setting the following in the [.signer.env](.signer.env) file:

```
TENANT_SEED_DEGREES=z1AoLPRWHSKasPH1unbY1A6ZFF2Pdzzp7D2CkpK6YYYdKTN
TENANT_SEED_ECON101=Z1genK82erz1AoLPRWHSKZFF2Pdzzp7D2CkpK6YYYdKTNat
```

and the following to the [.coordinator.env](.coordinator.env) file:

```
TENANT_TOKEN_DEGREE=988DKLAJH93KDSFV
```

The tenant names can then be specified in the issuing invocation like so:

```
http://myhost.org/instance/degrees/credentials/issue
http://myhost.org/instance/econ101/credentials/issue
```

And since you set a token for the degrees tenant, you'll have to include that token in the auth header as a Bearer token.  A curl command to issue on the degrees endpoint would then look like:

```
curl --location 'http://localhost:4007/instance/degrees/credentials/issue' \
--header 'Authorization: Bearer 988DKLAJH93KDSFV' \
--header 'Content-Type: application/json' \
--data-raw '{ 
  VC goes here
}'
```

### Enable Revocation

The issuer provides an optional revocation (or 'status') mechanism that implements the [StatusList2021 specification](https://www.w3.org/TR/vc-status-list/), using Github to store the access list. So to use the list you'll have to create two new github repositories that will be used exclusively to manage the status.  Full details of the implementation are [here](https://github.com/digitalcredentials/status-list-manager-git)

For this MVP implementation of the issuer we've only exposed the github options, but if you would like to use gitlab instead, just let us know and we can expose those options.

Revoking a credential is described in [Usage - revoking](#revoking)

#### Create Github repositories

Create two repositories, one public and one private. Call them anything you like, but something like myproject-status-list (public) and myproject-status-list-meta (private) are good choices. If you need help, instructions are [here](https://github.com/digitalcredentials/credential-status-manager-git#create-credential-status-repositories)

Get a Github token with access to the repositories as described [here](https://github.com/digitalcredentials/credential-status-manager-git#generate-access-tokens)

Now set these in the [.status.env](.status.env) file, which has the following options:

| Key | Description | Default | Required |
| --- | --- | --- | --- |
| `PORT` | http port on which to run the express app | 4008 | no |
| `CRED_STATUS_OWNER` | name of the owner account (personal or organization) in the source control service that will host the credential status resources | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_REPO_NAME` | name of the credential status repository | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_META_REPO_NAME` | name of the credential status metadata repository | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_ACCESS_TOKEN` | Github access token for the credential status repositories | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_DID_SEED` | seed used to deterministically generate DID | no | yes if ENABLE_STATUS_ALLOCATION is true |

The `CRED_STATUS_DID_SEED` is set to a default seed, usable by anyone for testing. You'll have to change that to use your own seed. Follow the instructions in [Generate a new Key](#generate-a-new-key) to generate a new key seed, and set the value (from the 'seed' property of the object returned from the seed generator). 

### DID Registries

To know that a credential was signed with a key that is in fact owned by the claimed issuer, the key (encoded as a DID) has to be confirmed as really belonging to that issuer.  This is typically done by adding the DID to a well known registry that the verifier checks when verifying a credential.

The DCC provides a number of registries that work with the verifiers in the Learner Credential Wallet and in the online web based [Verifier Plus](https://verifierplus.org).  The DCC registries use Github for storage.  To request that your DID be added to a registry, submit a pull request in which you've added your [DID](https://www.w3.org/TR/did-core/) to the registry file.

### did:key

For the moment, the issuer is set up to use the did:key implemenation of a DID which is one of the simpler implementations and doesn't require that the DID document be hosted anywhere.

### did:web

The did:web implementation is likely where most implementations will end up, and so you'll eventually want to move to becuase it allows you to rotate (change) your signing keys whithout having to update every document that points at the old keys.  We'll provide did:web support in time, but if you need it now just let us know.

## Usage

### Issuing

All right, now that you've got everything installed, you can start issuing cryptographically signed credentials.  Try it out with this CURL command, which you simply paste into the terminal, and which uses the default tenant:

```
curl --location 'http://localhost:4005/instance/default/credentials/issue' \
--header 'Content-Type: application/json' \
--data-raw '{ 
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context.json"
  ],
  "id": "urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1", 
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential"
  ],
  "issuer": {
    "id": "the issuer code will set this as the issuing DID", 
    "type": "Profile",
    "name": "DCC Test Issuer",
    "description": "A test DID used to issue test credentials",
    "url": "https://digitalcredentials.mit.edu",
    "image": {
	    "id": "https://user-images.githubusercontent.com/947005/133544904-29d6139d-2e7b-4fe2-b6e9-7d1022bb6a45.png",
	    "type": "Image"
	  }	
  },
  "issuanceDate": "2020-01-01T00:00:00Z", 
  "expirationDate": "2025-01-01T00:00:00Z",
  "name": "Successful Installation",
  "credentialSubject": {
      "type": "AchievementSubject",
     "name": "Me!",
     "achievement": {
      	"id": "http://digitalcredentials.mit.edu",
      	"type": "Achievement",
      	"criteria": {
        	"narrative": "Successfully installed the DCC issuer."
      	},
      	"description": "DCC congratulates you on your successful installation of the DCC Issuer.", 
      	"name": "Successful Installation",
      	"image": {
	    	"id": "https://user-images.githubusercontent.com/752326/214947713-15826a3a-b5ac-4fba-8d4a-884b60cb7157.png",
	    	"type": "Image"
	  	}
      }
  	}
}'
```

This should return a fully formed and signed credential printed to the terminal, that should look something like this (it will be all smushed up, but you can format it in something like [json lint](https://jsonlint.com):


```
{
	"@context": ["https://www.w3.org/2018/credentials/v1", "https://purl.imsglobal.org/spec/ob/v3p0/context.json", "https://w3id.org/vc/status-list/2021/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
	"id": "urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1",
	"type": ["VerifiableCredential", "OpenBadgeCredential"],
	"issuer": {
		"id": "did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy",
		"type": "Profile",
		"name": "DCC Test Issuer",
		"description": "A test DID used to issue test credentials",
		"url": "https://digitalcredentials.mit.edu",
		"image": {
			"id": "https://certificates.cs50.io/static/success.jpg",
			"type": "Image"
		}
	},
	"issuanceDate": "2020-01-01T00:00:00Z",
	"expirationDate": "2025-01-01T00:00:00Z",
	"name": "Successful Installation",
	"credentialSubject": {
		"type": "AchievementSubject",
		"name": "Me!",
		"achievement": {
			"id": "http://digitalcredentials.mit.edu",
			"type": "Achievement",
			"criteria": {
				"narrative": "Successfully installed the DCC issuer."
			},
			"description": "DCC congratulates you on your successful installation of the DCC Issuer.",
			"name": "Successful Installation",
			"image": {
				"id": "https://certificates.cs50.io/static/success.jpg",
				"type": "Image"
			}
		}
	},
	"credentialStatus": {
        "id": "https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4#16",
        "type": "StatusList2021Entry",
        "statusPurpose": "revocation",
        "statusListIndex": 16,
        "statusListCredential": "https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4"
    },
	"proof": {
		"type": "Ed25519Signature2020",
		"created": "2023-05-19T14:47:25Z",
		"verificationMethod": "did:key:z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy#z6Mkf2rgv7ef8FmLJ5Py87LMa7nofQgv6AstdkgsXiiCUJEy",
		"proofPurpose": "assertionMethod",
		"proofValue": "zviQazCEMihts4e6BrhxkEu5VbCPFqTFLY5qBkiRztf3eq1vXYXUCQrTL6ohxmMrsAPEJpB9WGbN1NH5DsSDHsCU"
	}
}
```

NOTE: the `credentialStatus` section will only have been added if you enabled revocation.

NOTE: CURL can get a bit clunky if you want to experiment, so you might consider trying [Postman](https://www.postman.com/downloads/) which makes it very easy to construct and send http calls.

### Revoking

Revocation is more fully explained in the StatusList2021 specification and the DCC [git based status implemenation](https://github.com/digitalcredentials/credential-status-manager-git), but it amounts to POSTing an object to the revocation endpoint, like so:

```
{
	credentialId: 'id_added_by_status_manager_to_credentialStatus_propery_of_VC',
	credentialStatus: [{
		type: 'StatusList2021Credential',
		status: 'revoked'
	}]
}
```

The important part there is the `credentialId`, which is listed in the `credentialStatus` section of the issued credential (`credentialStatus` is added by the status service), and which you have to store at the point when you issue the credential. The `credentialStatus` section looks like this:

```
"credentialStatus": {
        "id": "https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4#16",
        "type": "StatusList2021Entry",
        "statusPurpose": "revocation",
        "statusListIndex": 16,
        "statusListCredential": "https://digitalcredentials.github.io/credential-status-jc-test/XA5AAK1PV4"
    }
```

and the id you need is in the `id` property.

So again, an important point here is that you must store the credentialStatus.id for all credentials that you issue. A common approach might be to add another column to whatever local database you are using for your credential records, which would then later make it easier for you to find the id you need by searching the other fields like student name or student id.

NOTE: you'll of course have to have [set up revocation](#enable-revocation) for this to work. If you've only done the QuickStart then you'll not be able to revoke.

## Learner Credential Wallet

You might now consider importing your new credential into the [Learner Credential Wallet](https://lcw.app) to see how credentials can be managed and shared from an app based wallet.  Simply copy the verifiable credential you just generated and paste it into the text box on the 'add credential' screen of the wallet.

## Development

### Installation

Clone code then cd into directory and:

```
npm install
npm run dev
```

If for whatever reason you need to run the server over https, you can set the `ENABLE_HTTPS_FOR_DEV` environment variable to true.  Note, though, that this should ONLY be used for development.

### Testing

Testing uses supertest, jest, and nock to test the endpoints.  To run tests:

```npm run test```

Because the revocation (status) system uses github to store status, calls are made out to github during issuance.  Rather than have to make these calls for every test, and possibly in cases where outgoing http calls aren't ideal, we've used [nock](https://github.com/nock/nock) to mock out the http calls to the github api, so that the actual calls needn't be made - nock instead returns our precanned replies.  Creating mocks can be time consuming, though, so we've also opted to use the recording feature of nock which allows us to run the tests in 'record' mode which will make the real calls out to Github, and record the results so they can be used for future calls.

## Contribute

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT License](LICENSE.md) © 2023 Digital Credentials Consortium.
