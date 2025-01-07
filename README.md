# openrpc-checker

A small utility to validate and compare OpenRPC documents.

## Install

```shell
yarn
yarn build
./bin/openrpc-checker --help
```

# Usage

## `diff`

Compare an OpenRPC document (`target`) against another OpenRPC document (`spec`).

```shell
Usage: openrpc-checker diff [options]

Compare to OpenRPC documents

Options:
  -s, --spec <PATH>    Path to spec file
  -t, --target <PATH>  Path to target file
  --ref-parser         Use json-schema-ref-parser instead of schema-utils-js (default: false)
  -h, --help           display help for command
```

## `check`

Sanity check to ensure an OpenRPC can be successfully loaded.

```shell
Usage: openrpc-checker check [options]

Validate an OpenRPC document

Options:
  -t, --target <PATH>  Path to target file
  --ref-parser         Use json-schema-ref-parser instead of schema-utils-js (default: false)
  -h, --help           display help for command
```

# Checks

All documents are examined at three levels:
- `$method` - compare the top-level fields inside a method definition
- `$method.params` - compare each of the parameters for the given method
- `$method.result` - compare the result of the given method

Currently the following checks are supported:
- `$method`
  - `name` MUST be equal
  - `param-structure` MUST be equal
- `$method.params`
  - `required` MUST be equal
  - `schema` MUST be equivalent
- `$method.result`
  - `required` MUST be equal
  - `schema` MUST be equivalent

## Adding Additional Checks

Each check requires two components:
- a check function
- an issue type

Check functions are implemented in `src/checks`. Ensure that new checks are added to the array at the bottom of the corresponding file. This will add them to the set of checks invoked on each run.

Issues are implemented in `src/issues`. The message passed to the `super()` constructor will be used to print the 
issue details to the user if one is found. 

Once you have created a check function and a corresponding issue type, create a test in `src/diff.spec.ts`. 

Lastly, make sure to specify the check in the list above.
