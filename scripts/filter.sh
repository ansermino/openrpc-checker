#!/bin/bash

DEFAULT_FILTER="^Filecoin.(Auth|Chain)"

if [ $# -ne 2 ]; then
    echo "Usage: $0 <INPUT> <OUTPUT>"
    echo "(Optional) Specify a filter: FILTER=\"Auth|Chain|State\""
    exit 1
fi

input=$1
output=$2

if [ -z "${FILTER}" ]; then
  FILTER=${DEFAULT_FILTER}
  echo "Using default filter: ${FILTER}"
else
  FILTER="^Filecoin.(${FILTER})"
fi

jq --arg re "$FILTER" '{openrpc: .openrpc, info: .info, methods: [.methods[] | select(.name | test($re))], components: .components}' $input > $output

echo "Output written to ${output}"
