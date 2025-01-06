# openrpc-checker

A small utility to validate and compare OpenRPC documents.

## Install

```shell
yarn
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

# Contributing

## Adding Additional Checks

[TODO]
