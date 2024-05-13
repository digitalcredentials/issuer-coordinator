# Digital Credentials Consortium Verifiable Credentials Issuer

[![Build status](https://img.shields.io/github/actions/workflow/status/digitalcredentials/issuer-coordinator/main.yml?branch=main)](https://github.com/digitalcredentials/issuer-coordinator/actions?query=workflow%3A%22Node.js+CI%22)

An express app that signs Verifiable Credentials. The app coordinates calls to a signing service and a status service, each themselves running as express apps, with all three apps running together within Docker Compose.

![services-flow](./images/services-flow.jpg)

Try it in five minutes or less with our [Quick Start](#quick-start).

Note that you needn't clone this repository to use the issuer - you can simply run the provided docker-compose file, which pulls pre-built images from DockerHub. 

## Table of Contents

- [Summary](#summary)
- [API](#api)
  - [VC-API](#vc-api)
  - [DID Generators](#did-generators)
  - [healthz endpoint](#healthz-endpoint)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Generate a New Key](#generate-a-new-key)
  - [Tenants](#tenants)
    - [Add a Tenant ](#add-a-tenant)
	- [Use a Tenant](#use-a-tenant)
  - [Enable Revocation](#enable-revocation)
  - [DID Registries](#did-registries)
  - [did:key](#didkey)
  - [did:web](#didweb)
  - [Revoking](#revoking)
- [Usage](#usage)
  - [Issuing](#issuing)
  - [Revoking](#revoking)
- [Logging](#logging)
- [Health Check](#health-check)
- [Learner Credential Wallet](#learner-credential-wallet)
- [Development](#development)
  - [Testing](#testing)
- [Contribute](#contribute)
- [License](#license)

## Summary

Use this app to issue [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) with a [revocation status](https://www.w3.org/TR/vc-status-list/) that can later be updated to revoke the credential.

We've tried hard to make this simple to install and maintain, and consequently easy to evaluate and understand as you consider whether digital credentials are useful for your project, and whether this issuer would work for you. 

In particular, we've separated the discrete parts of an issuer into smaller self-contained apps that are therefore easier to understand and evaluate, and easier to *wire* together to compose functionality. The apps are typically wired together in a simple docker compose network that pulls images from DockerHub.

We've made installation a gradual process starting with a simple version that can be up and running in about five minutes, and then progressing with configuration as needed.

## Quick Start

These four step should take less than five minutes in total:

### Install Docker

Docker have made this straightforward, with [installers for Windows, Mac, and Linux](https://docs.docker.com/engine/install/) that make it as easy to install Docker as any other application.

### Make a Docker Compose file

Create a file called compose.yaml and add the following

```
version: '3.5'
services:
  coordinator:
    image: digitalcredentials/issuer-coordinator:0.3.0
    ports:
      - "4005:4005"
  signer:
    image: digitalcredentials/signing-service:0.4.0
```

### Run it

From the terminal in the same directory that contains your compose.yaml file:

```docker compose up```

### Issue

Issue cryptographhically signed credentials by posting unsigned verifiable credentials to the issue endpoint, which signs the credential and returns it. Try out your test issuer with this CURL command, which you simply paste into the terminal:

```
curl --location 'http://localhost:4005/instance/test/credentials/issue' \
--header 'Content-Type: application/json' \
--data-raw '{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json"
  ],
  "id": "urn:uuid:2fe53dc9-b2ec-4939-9b2c-0d00f6663b6c",
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential"
  ],
  "name": "DCC Test Credential",
  "issuer": {
    "type": [
      "Profile"
    ],
    "id": "did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC",
    "name": "Digital Credentials Consortium Test Issuer",
    "url": "https://dcconsortium.org",
    "image": "https://user-images.githubusercontent.com/752326/230469660-8f80d264-eccf-4edd-8e50-ea634d407778.png"
  },
  "issuanceDate": "2023-08-02T17:43:32.903Z",
  "credentialSubject": {
    "type": [
      "AchievementSubject"
    ],
    "achievement": {
      "id": "urn:uuid:bd6d9316-f7ae-4073-a1e5-2f7f5bd22922",
      "type": [
        "Achievement"
      ],
      "achievementType": "Diploma",
      "name": "Badge",
      "description": "This is a sample credential issued by the Digital Credentials Consortium to demonstrate the functionality of Verifiable Credentials for wallets and verifiers.",
      "criteria": {
        "type": "Criteria",
        "narrative": "This credential was issued to a student that demonstrated proficiency in the Python programming language that occurred from **February 17, 2023** to **June 12, 2023**."
      },
      "image": {
        "id": "https://user-images.githubusercontent.com/752326/214947713-15826a3a-b5ac-4fba-8d4a-884b60cb7157.png",
        "type": "Image"
      }
    },
    "name": "Jane Doe"
  }
}'
```

This should return a fully formed and signed credential printed to the terminal, that should look something like this (it will be all smushed up, but you can format it in something like [json lint](https://jsonlint.com)):

```
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json",
        "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "urn:uuid:2fe53dc9-b2ec-4939-9b2c-0d00f6663b6c",
    "type": [
        "VerifiableCredential",
        "OpenBadgeCredential"
    ],
    "name": "DCC Test Credential",
    "issuer": {
        "type": [
            "Profile"
        ],
        "id": "did:key:z6MknNQD1WHLGGraFi6zcbGevuAgkVfdyCdtZnQTGWVVvR5Q",
        "name": "Digital Credentials Consortium Test Issuer",
        "url": "https://dcconsortium.org",
        "image": "https://user-images.githubusercontent.com/752326/230469660-8f80d264-eccf-4edd-8e50-ea634d407778.png"
    },
    "issuanceDate": "2023-08-02T17:43:32.903Z",
    "credentialSubject": {
        "type": [
            "AchievementSubject"
        ],
        "achievement": {
            "id": "urn:uuid:bd6d9316-f7ae-4073-a1e5-2f7f5bd22922",
            "type": [
                "Achievement"
            ],
            "achievementType": "Diploma",
            "name": "Badge",
            "description": "This is a sample credential issued by the Digital Credentials Consortium to demonstrate the functionality of Verifiable Credentials for wallets and verifiers.",
            "criteria": {
                "type": "Criteria",
                "narrative": "This credential was issued to a student that demonstrated proficiency in the Python programming language that occurred from **February 17, 2023** to **June 12, 2023**."
            },
            "image": {
                "id": "https://user-images.githubusercontent.com/752326/214947713-15826a3a-b5ac-4fba-8d4a-884b60cb7157.png",
                "type": "Image"
            }
        },
        "name": "Jane Doe"
    },
    "proof": {
        "type": "Ed25519Signature2020",
        "created": "2023-10-05T11:17:41Z",
        "verificationMethod": "did:key:z6MknNQD1WHLGGraFi6zcbGevuAgkVfdyCdtZnQTGWVVvR5Q#z6MknNQD1WHLGGraFi6zcbGevuAgkVfdyCdtZnQTGWVVvR5Q",
        "proofPurpose": "assertionMethod",
        "proofValue": "z5fk6gq9upyZvcFvJdRdeL5KmvHr69jxEkyDEd2HyQdyhk9VnDEonNSmrfLAcLEDT9j4gGdCG24WHhojVHPbRsNER"
    }
}

```

WARNING: DO NOT USE THIS TO ISSUE `REAL` CREDENTIALS UNTIL YOU'VE [SET YOUR OWN SIGNING KEY](#generate-a-new-key)

NOTE: CURL can get a bit clunky if you want to experiment, so you might consider trying [Postman](https://www.postman.com/downloads/) which makes it very easy to construct and send http calls.

NOTE: Revocation is not enabled in the Quick Start. You've got to setup a couple of thigs to [enable revocation](#enable-revocation).

Great - you've issued a cryptographically signed credential. Now you'll want to configure the application to issue credentials signed with your own private key (the credential you just issued was signed with a test key that is freely shared so can't be used in production). First a quick word about versioning, and then on to configuration...

## Versioning

The issuer-coordinator and the services it coordinates are all intended to run as docker images within a docker compose network. For convenience we've published those images to Docker Hub so that you don't have to build them locally yourself from the github repositories.

The images on Docker Hub will of course be updated to add new functionality and fix bugs. Rather than overwrite the default (`latest`) version on Docker Hub for each update, we've adopted the [Semantic Versioning Guidelines](https://semver.org) with our docker image tags.

We DO NOT provide a `latest` tag so you must provide a tag name (i.e, the version number) for the images in your docker compose file, as we've done [here](./docker-compose.yml).

To ensure you've got compatible versions of the services and the coordinator, take a look at our [sample compose files](https://github.com/digitalcredentials/docs/blob/main/deployment-guide/DCCDeploymentGuide.md#docker-compose-examples).

If you do ever want to work from the source code in the repository and build your own images, we've tagged the commits in Github that were used to build the corresponding Docker image. So a github tag of v0.1.0 coresponds to a docker image tag of 0.1.0

## Configuration

There are a few things you'll want to configure, in particular setting your own signing keys (so that only you can sign your credentials). Other options include enabling revocation, enabling healthchecks, and allowing for 'multi-tenant' signing, which you might use, for example, to sign credentials for different courses with a different key.

Because the issuer-coordinator coordinates calls to other microservices, you'll need to configure both the coordinator itself, and the microservices it calls.

You can set the environment variables in any of the usual ways that environment variables are set, including .env files or even setting the variables directly in the docker compose yaml file. Our quick start compose files, for example, all set the variables directly in the compose so as to make it possible to start up the compose with a single command. Further below we describe sample .env files for the coorindator and dependent services.

### Environment Variables

The variables that can be configured specifically for the issuer-coordinator:


TO ADD:
    enableAccessLogging: env.ENABLE_ACCESS_LOGGING?.toLowerCase() === 'true',
    enableStatusService: env.ENABLE_STATUS_SERVICE?.toLowerCase() === 'true',
    statusServiceEndpoint: env.STATUS_SERVICE_ENDPOINT ? env.STATUS_SERVICE_ENDPOINT : defaultStatusServiceEndpoint,
    signingServiceEndpoint: env.SIGNING_SERVICE_ENDPOINT ? env.SIGNING_SERVICE_ENDPOINT : defaultSigningServiceEndpoint,

| Key | Description | Default | Required |
| --- | --- | --- | --- |
| `PORT` | http port on which to run the express app | 4005 | no |
| `ENABLE_HTTPS_FOR_DEV` | runs the dev server over https - ONLY FOR DEV - typically to allow CORS calls from a browser | false | no |
| `TENANT_TOKEN_{TENANT_NAME}` | see [tenants](#tenants) section for instructions | no | no |
| `ENABLE_ACCESS_LOGGING` | log all http calls to the service - see [Logging](#logging) | true | no |
| `ERROR_LOG_FILE` | log file for all errors - see [Logging](#logging) | no | no |
| `LOG_ALL_FILE` | log file for everything - see [Logging](#logging) | no | no |
| `CONSOLE_LOG_LEVEL` | console log level - see [Logging](#logging) | silly | no |
| `LOG_LEVEL` | log level for application - see [Logging](#logging) | silly | no |
| `HEALTH_CHECK_SMTP_HOST` | SMTP host for unhealthy notification emails - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_SMTP_USER` | SMTP user for unhealthy notification emails - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_SMTP_PASS` | SMTP password for unhealthy notification emails - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_EMAIL_FROM` | name of email sender for unhealthy notifications emails - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_EMAIL_RECIPIENT` | recipient when unhealthy - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_EMAIL_SUBJECT` | email subject when unhealthy - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_WEB_HOOK` | posted to when unhealthy - see [Health Check](#health-check) | no | no |
| `HEALTH_CHECK_SERVICE_URL` | local url for this service - see [Health Check](#health-check) | http://SIGNER:4006/healthz | no |
| `HEALTH_CHECK_SERVICE_NAME` | service name to use in error messages - see [Health Check](#health-check) | SIGNING-SERVICE | no |

The environment variables can be set directly in the docker compose using the ENV directive, or alternatively with three .env files:

* [.coordinator.env](./.coordinator.env)
* [.signing-service.env](./.signing-service.env)
* [.status-service.env](./.status-service.env)

If you've used the QuickStart docker-compose.yml, then you'll have to change it a bit to point at these files. Alternatively, we've pre-configured this [docker-compose.yml](./docker-compose.yml), though, so you can just use that.

The issuer is pre-configured with a preset signing key for testing that can only be used for testing and evaluation. Any credentials signed with this key are meaningless because anyone else can use it to sign credentials, and so could create fake copies of your credentials which would appear to be properly signed. There would be no way to know that it was fake. So, you'll want to add our own key which you do by generating a new key and setting it for a new tenant name.

### Generate a new key

To issue your own credentials you must generate your own signing key and keep it private.  We've tried to make that a little easier by providing two convenience endpoints in the issuer that you can use to generate a brand new random key - one using the did:key method and one using the did:web method. You can hit the endpoints with the following CURL command (in a terminal):

#### did:key

`curl --location 'http://localhost:4005/did-key-generator'`

#### did:web

`curl --location 'http://localhost:4005/did-web-generator'`

Both endpoints simply forward your call to the equivalent endpoint in the signing-service. You can read about the endpoints in the [Signing Key section of the signing-service README](https://github.com/digitalcredentials/signing-service/blob/main/README.md#didkey-generator).

Now that you've got your key you'll want to enable it by adding a new tenant to use the seed...

### Tenants

You might want to allow more than one signing key/DID to be used with the issuer. For example, you might want to sign university/college degree diplomas with a DID that is only used by the registrar, but also allow certificates for individual courses to be signed by by different DIDS that are owned by the faculty or department or even the instructors that teach the courses.

We're calling these differents signing authorities 'tenants'.  

#### Add a Tenant

Adding a tenant amounts to adding one line each to 

* [.coordinator.env](.coordinator.env)
* [.signing-service.env](.signing-service.env)

##### .coordinator.env

Add a line like:

```
TENANT_TOKEN_{TENANT_NAME}={TOKEN}
```

Replace `{TENANT_NAME}` with your new tenant name, and `{TOKEN}` with an authentication token to protect your endpoint.

For example:

```
TENANT_TOKEN_ECON101=988DKLAJH93KDSFV
```

The token can be anything you like (e.g. a UUID). To leave the endpoint unprotected, set the token value to  'UNPROTECTED', e.g.,

```
TENANT_SEED_ECON101=UNPROTECTED
```

If you set a value other than UNPROTECTED then that value must be included as a Bearer token in the Authorization header of any calls to the endpoint.

We also suggest using IP filtering on your endpoints to only allow set IPs to access the issuer.  Set filtering in your nginx config, or similar.

##### .signing-service.env

The [signing-service README](https://github.com/digitalcredentials/signing-service/blob/main/README.md#didkey-generator) explains how to set your DID, whether using did:key or did:web. Note that the signing-service docs describe using convenience endpoints to generate new DIDs. You can call those endpoints directly in the signing-service, or call the same endpoints in the coordinator, as described above in the [Generate a new key section](#generate-a-new-key). The coordinator endpoints simply forward the request to the signing-service.

#### Use a tenant

Tenant names are specified in the issuing endpoint like so:

```
http://myhost.org/instance/econ101/credentials/issue
```

where `econ101` is the tenant name you'd have set in the env files.

If you set a token for the tenant, you'll have to include that token in the auth header as a Bearer token.  A curl command to issue on the `econ101` endpoint would then look exactly like the call in the example above, but with the bearer token set in the 'Authorization' header like so:

```
curl --location 'http://localhost:4005/instance/econ101/credentials/issue' \
--header 'Authorization: Bearer 988DKLAJH93KDSFV' \
--header 'Content-Type: application/json' \
--data-raw '{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json"
  ],
  "id": "urn:uuid:2fe53dc9-b2ec-4939-9b2c-0d00f6663b6c",
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential"
  ],
  "name": "DCC Test Credential",
  "issuer": {
    "type": [
      "Profile"
    ],
    "id": "did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC",
    "name": "Digital Credentials Consortium Test Issuer",
    "url": "https://dcconsortium.org",
    "image": "https://user-images.githubusercontent.com/752326/230469660-8f80d264-eccf-4edd-8e50-ea634d407778.png"
  },
  "issuanceDate": "2023-08-02T17:43:32.903Z",
  "credentialSubject": {
    "type": [
      "AchievementSubject"
    ],
    "achievement": {
      "id": "urn:uuid:bd6d9316-f7ae-4073-a1e5-2f7f5bd22922",
      "type": [
        "Achievement"
      ],
      "achievementType": "Diploma",
      "name": "Badge",
      "description": "This is a sample credential issued by the Digital Credentials Consortium to demonstrate the functionality of Verifiable Credentials for wallets and verifiers.",
      "criteria": {
        "type": "Criteria",
        "narrative": "This credential was issued to a student that demonstrated proficiency in the Python programming language that occurred from **February 17, 2023** to **June 12, 2023**."
      },
      "image": {
        "id": "https://user-images.githubusercontent.com/752326/214947713-15826a3a-b5ac-4fba-8d4a-884b60cb7157.png",
        "type": "Image"
      }
    },
    "name": "Jane Doe"
  }
}'
```

### Enable Revocation

The issuer provides an optional revocation (or 'status') mechanism that implements the [StatusList2021 specification](https://www.w3.org/TR/vc-status-list/), using Github to store the access list. So to use the list you'll have to create two new github repositories that will be used exclusively to manage the status.  Full details of the implementation are [here](https://github.com/digitalcredentials/status-list-manager-git)

For this MVP implementation of the issuer we've only exposed the github options, but if you would like to use gitlab instead, just let us know and we can expose those options.

Revoking a credential is described in [Usage - revoking](#revoking)

#### Create Github repositories

Create two repositories, one public and one private. Call them anything you like, but something like myproject-status-list (public) and myproject-status-list-meta (private) are good choices. If you need help, instructions are [here](https://github.com/digitalcredentials/credential-status-manager-git#create-credential-status-repositories)

Get a Github token with access to the repositories as described [here](https://github.com/digitalcredentials/credential-status-manager-git#generate-access-tokens)

Now set these in the [.status-service.env](.status-service.env) file, which has the following options:

| Key | Description | Default | Required |
| --- | --- | --- | --- |
| `PORT` | http port on which to run the express app | 4005 | no |
| `CRED_STATUS_OWNER` | name of the owner account (personal or organization) in the source control service that will host the credential status resources | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_REPO_NAME` | name of the credential status repository | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_META_REPO_NAME` | name of the credential status metadata repository | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_ACCESS_TOKEN` | Github access token for the credential status repositories | no | yes if ENABLE_STATUS_ALLOCATION is true |
| `CRED_STATUS_DID_SEED` | seed used to deterministically generate DID | no | yes if ENABLE_STATUS_ALLOCATION is true |

The `CRED_STATUS_DID_SEED` is set to a default seed, usable by anyone for testing. You'll have to change that to use your own seed. Follow the instructions in [Generate a new Key](#generate-a-new-key) to generate a new key seed, and set the value (from the 'seed' property of the object returned from the seed generator). 

### DID Registries

To know that a credential was signed with a key that is in fact owned by the claimed issuer, the key (encoded as a [DID](https://www.w3.org/TR/did-core/)) has to be confirmed as really belonging to that issuer.  This is typically done by adding the [DID](https://www.w3.org/TR/did-core/) to a well known registry that the verifier checks when verifying a credential.

The DCC provides a number of registries that work with the verifiers in the Learner Credential Wallet and in the online web based [Verifier Plus](https://verifierplus.org).  The DCC registries use Github for storage.  To request that your DID be added to a registry, submit a pull request in which you've added your [DID](https://www.w3.org/TR/did-core/) to the registry file.

### did:key

For the moment, the issuer is set up to use the did:key implemenation of a [DID](https://www.w3.org/TR/did-core/) which is one of the simpler implementations and doesn't require that the [DID](https://www.w3.org/TR/did-core/) document be hosted anywhere.

### did:web

The did:web implementation is likely where many implementations will end up, and so you'll eventually want to move to becuase it allows you to rotate (change) your signing keys whithout having to update every document that points at the old keys.

## Usage

### Issuing

Pretty much just follow the example in the Quick Start, substituting your own tenant names on the endpoint, and posting your own Verifiable Credential.

It is likely that you'll use this issuer as part of some larger system of your own where your flow goes something like:

* student opens a web page on your school site to request their credential
* you authenticate the student with campus authentication
* you retrieve the data for the student's credential from wherever you keep the data
* you create a verifiale credential by adding the student specific data to some verifiable credential template you've preconstructed
* you pass the populated verifiable credential to this issuer
* the issuer signs it and returns it to your calling code
* your code returns the credential to the student
* the student can then share the credential with others
* the student might also want to import the credential into a wallet like the  [Learner Credential Wallet (LCW)](#learner-credential-wallet)

The DCC provides another issuing service called the [exchange-coordinator](https://github.com/digitalcredentials/exchange-coordinator) which can make it a bit easier to directly issue credentials to the Learner Credential Wallet. It is used similarly to this issuer, but incorporates a direct 'exchange' with the Learner Credential Wallet.

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

### API

#### VC-API

This app implements two [VC-API](https://w3c-ccg.github.io/vc-api/) http endpoints:

 * [POST /credentials/issue](https://w3c-ccg.github.io/vc-api/#issue-credential)
 * [POST /credentials/status](https://w3c-ccg.github.io/vc-api/#update-status)

The hope is that by following the VC-API spec, you should be able to substitute any implementation of the spec, thereby allowing you to later switch implementations and/or vendors.

#### DID Generators

The app additionally two utility endpoints for generating new [DIDs](https://www.w3.org/TR/did-core/):

 * [GET /did-key-generator](#didkey)
 * [POST /did-web-generator](#didweb)

#### healthz endpoint

and finally an endpoint that returns the health of the service, and is typically meant to be used with Docker [HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck):

 * [GET /heathz]()

## Logging

We support the following log levels:

```
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
```

Logging is configured with environment variables, as defined in the [Environment Variables](#environment-variables) section.

By default, everything is logged to the console (log level `silly`).

All http calls to the service are logged by default, which might bloat the log. You can disable access logging with:

```ENABLE_ACCESS_LOGGING=false```

You may set the log level for the application as whole, e.g.,

```LOG_LEVEL=http```

Which would only log messages with severity 'http' and all below it (info, warn, error).

The default is to log everything (level 'silly').

You can also set the log level for console logging, e.g.,

```CONSOLE_LOG_LEVEL=debug```

This would log everything for severity 'debug' and lower (i.e., verbose, http, info, warn, error). This of course assumes that you've set the log level for the application as a whole to at least the same level.

The default log level for the console is 'silly', which logs everything.

There are also two log files that can be enabled:

* errors (only logs errors)
* all (logs everything - all log levels)

Enable each log by setting an env variable for each, indicating the path to the appropriate file, like this example:

```
LOG_ALL_FILE=logs/all.log
ERROR_LOG_FILE=logs/error.log

## Health Check

Docker has a [HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck) option for monitoring the
state (health) of a container. We've included an endpoint `GET /healthz` that checks the health of the signing service (by running a test signature). The endpoint can be directly specified in a CURL or WGET call on the HEALTHCHECK, but we also provide a [healthcheck.js](./healthcheck.js) function that can be similarly invoked by the HEALTHCHECK and which itself hits the `healthz` endpoint, and additionally provides options for both email and Slack notifications when the service is unhealthy. 

You can see how we've configured the HEALTHCHECK in our [example compose files](https://github.com/digitalcredentials/docs/blob/main/deployment-guide/DCCDeploymentGuide.md#docker-compose-examples). Our compose files also include an example of how to use [autoheal](https://github.com/willfarrell/docker-autoheal) together with HEALTHCHECK to restart an unhealthy container.

If you want failing health notifications sent to a Slack channel, you'll have to set up a Slack [web hook](https://api.slack.com/messaging/webhooks).

If you want failing health notifications sent to an email address, you'll need an SMTP server to which you can send emails, so something like sendgrid, mailchimp, mailgun, or even your own email account if it allows direct SMTP sends. Gmail can apparently be configured to so so.

## Learner Credential Wallet

You might now consider importing your new credential into the [Learner Credential Wallet](https://lcw.app) to see how credentials can be managed and shared from an app based wallet.  Simply copy the verifiable credential you just generated and paste it into the text box on the 'add credential' screen of the wallet.

## Development

To run the issuer-coordinator locally from the cloned repository, you'll also have to clone the repository for the [signing-service](https://github.com/digitalcredentials/signing-service) and have it running locally at the same time. And, similarly, if you want to include status allocation, you'll also have to clone the repository for the [status-service](https://github.com/digitalcredentials/signing-service) and run that locally as well.

When running locally, the system picks up environment variables from the standard [.env](./.env) file, rather than from the env files that we recommend using with docker compose.

### Installation

Clone code then cd into directory and:

```
npm install
npm run dev
```

### Testing

Testing uses supertest, mocha, and nock to test the endpoints.  To run tests:

```npm run test```

Note that when testing we don't actually want to make live http calls to the services,
so we've used nock to intercept the http calls and return precanned data.

## Contribute

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT License](LICENSE.md) © 2023 Digital Credentials Consortium.
