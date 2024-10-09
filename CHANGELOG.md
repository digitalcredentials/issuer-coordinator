# issuer-coordinator Changelog

## 1.00 - 2024-10-09

### Changed
- updating semver to reflect breaking change
- **BREAKING**: The libs that were updated in the prior release (0.3.0) now require that the top level id on a verifiable credential must be a uri. Any old (or new) clients calling the endpoints on this service with a vc that doesn't have a uri id will fail.

## 0.3.0 - 2024-09-06

### Changed
- Convert Status List 2021 to Bitstring Status List.
- Update vc related libs, which also provide support for Verifiable Credentials version 2
- Differentiate between database status service and Git status service.
- Rename environment variables.
- Update revocation and suspension instructions.
- Add endpoint to retrieve status list from underlying database status service.

## 0.2.0 - 2024-04-22

### Changed
- add did-web-generator and did-key-generator endpoints
- update README
- added CHANGELOG
- update docker-compose.yml to use new versions

For previous history, see Git commits.