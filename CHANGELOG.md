# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### v2.0.0

- :rocket: Update to ETL-Base@2 to support output Schema

### v1.16.0

- :rocket: Add `remarks` and `stale` to Alerts

### v1.15.1

- :bug: Human Readable Coordinate Formatting

### v1.15.0

- :tada: Submit Alerts as CoT and use updated Alert API

### v1.14.0

- :rocket: Improved filtering of missing aircraft

### v1.13.1

- :bug: Fix TS Dep bug

### v1.13.0

- :rocket: Update core library to Typescript
- :arrow_up: Update to latest ETL-Base to support new alert() fn
- :tada: Add comparison check for DynamoDB known items

### v1.12.2

- :bug: Ensure IDs are populated

### v1.12.1

- :rocket: Update to new API Style for accessing env vars

### v1.12.0

- :tada: Add `course` and `speed` properties

### v1.11.0

- :bug: Avoid submitting duplicates
- :rocket: Avoid multiple iters of features array

### v1.10.0

- :bug: Convert alt. to meters & swich to `geom` value to match up with HAE

### v1.9.0

- :tada: Overwrite callsign with optional user provided callsign
- :rocket: Move known aircraft check to after initial submission for performance gains

### v1.8.0

- :tada: Add Icon Supoort

### v1.7.1

- :bug: JSON Schema Syntax Fix

### v1.7.0

- :rocket: Add `domain` field to input values

### v1.6.0

- :rocket: Significantly increased API Distance

### v1.5.0

- :rocket: Migrate to ETL Base Library

### v1.4.0

- :rocket: Add CoT Type

### v1.3.2

- :rocket: Add `display: table` to schema

### v1.3.1

- :bug: Fix lint

### v1.3.0

- :rocket: More complex schema expectations

### v1.2.1

- :rocket: Update to OIDC based ECR Creds

### v1.2.0

- :tada: Add the ability to limit returned features by a list of ids

### v1.1.1

- :bug: Don't stringify schema output

### v1.1.0

- :tada: Add schema option
- :bug: Fix string in ele coordinates

### v1.0.0

- :tada: Initial Commit
