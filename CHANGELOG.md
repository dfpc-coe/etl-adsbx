# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### v5.5.0

- :arrow_up: Update Core Deps

### v5.4.0

- :arrow_up: Update Core Deps

### v5.3.0

- :arrow_up: Update Core Deps

### v5.2.1

- :arrow_up: Update Core Deps

### v5.2.0

- :tada: Add option to style by hostile when in an emergency
- :rocket: Include aircraft type in output
- :rocket: Include aircraft ownership military/civilian in output

### v5.1.1

- :tada: Fix submission format

### v5.1.0

- :tada: Allow disablement of filters

### v5.0.0

- :tada: Update to `CloudTAK@v6`

### v4.5.0 - 2025-01-29

- :arrow_up: Update Core Deps

### v4.4.0 - 2024-10-17

- :arrow_up: Update Core Deps

### v4.3.0 - 2024-10-15

- :rocket: Add support for RapidAPI

### v4.2.0 - 2024-07-22

- :rocket: Remove `agency` types

### v4.1.0 - 2024-07-17

- :rocket: Add `group` types

### v4.0.1 - 2024-07-16

- :bug: Fix internal typing

### v4.0.0 - 2024-07-16

- :tada: Output all metadata to CloudTAK
- :rocket: Add ability to set query lat/lng and dist
- :rocket: Fully Typed input/output
- :rocket: Leaner environment in favour of Style Editor in UI

### v3.2.0

- :arrow_up: Remove initial down detection in favour of striaght data flow

### v3.1.1

- :arrow_up: Update to latest ETL Base

### v3.1.0

- :rocket: Update to latest metadata version

### v3.0.0

- :rocket: Update to new token format

### v2.0.4

- :arrow_up: Update deps

### v2.0.3

- :arrow_up: Update Push locations & Action Versions

### v2.0.2

- :arrow_up: Update Core Deps

### v2.0.1

- :bug: await Schema calls

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
