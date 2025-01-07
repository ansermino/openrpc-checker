# Summary

The `openrpc-diff` tool is able to successfully compare two OpenRPC documents. However, some issues have been identified in both the Lotus and Forest OpenRPC documents that require further investigation and discussion.

# Observations

## Lotus OpenRPC Document

The document from Lotus has two notable characteristics:

**1. All types are inlined. Unlike Forest, there are no references (`$ref`) used. This makes the document a bit easier to parse manually, although at the cost of duplicated type definitions.**

In Lotus, the overall document structure is:

```json
{
  "openrpc": "1.2.6",
  "info": {
    ...
  },
  "methods": [
    ...
  ]
}
```

Forest uses the additional `components.schemas` section to include the common/shared types:

```json
{
  "openrpc": "1.2.6",
  "info": {
    ...
  },
  "methods": [
    ...
  ],
  "components": {
    "schemas": {...}
  }
}
```

This difference should be purely syntactical, and not affecting the semantics of the schema. However this is an important difference when comparing against the Forest document.

**2. The process used to generate the document does not preserve method parameters names. For return values, the Go types are preserved exactly. Neither of these is ideal.**

For method parameters, the names used are `p1`, `p2`, etc...

```json
{
  "name": "p1",
  "description": "cid.Cid",
  "summary": "",
  "schema": {
    ...
    "type": ["string"]
  },
    ...
}
```

For return values, the types include language specific identifiers such as `*`. In this example the convention for defining a map is captured:

```json
"result": {
    "name": "map[string]interface{}",
    "description": "map[string]interface{}",
    "summary": "",
    "schema": {
      ...
    },
    "type": ["object"]
  },
    ...
},
```

Lotus uses reflection and some custom code to generate the OpenRPC document ([source](https://github.com/filecoin-project/lotus/blob/master/api/docgen-openrpc/cmd/docgen_openrpc.go)). This should enable any modifications that are required, but may involve additional development work.

## Forest OpenRPC Document

**3. A (valid) circular reference exists which breaks the OpenRPC tooling.**

For the `Filecoin.StateCall` method the return type contains a circular definition:

```json
"ExecutionTrace": {
  "type": "object",
  "required": ["GasCharges", "Msg", "MsgRct", "Subcalls"],
  "properties": {
    ...
    "Subcalls": {
      "$ref": "#/components/schemas/Nullable_Array_of_ExecutionTrace"
    }
  }
}
...
"Nullable_Array_of_ExecutionTrace": {
  "type": ["array", "null"],
  "items": {
    "$ref": "#/components/schemas/ExecutionTrace"
  }
},
```

This definition is valid per the JSON Schema and OpenRPC specifications. Using a general JSONSchema parser (eg. 
[@apidevtools/json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser)) it can be parsed 
successfully. However, using the OpenRPC tooling this results in an OOM crash. An reproducible has been created 
here: https://github.com/ansermino/openrpc-oom-demo. (Note: While the document is parsed correctly, interacting with 
the result also has issues).

Additionally, the flag `--ref-parse` can be used in 
`openrpc-checker` to use `json-schema-ref-parser` instead of the OpenRPC tooling.

> Note: The OpenRPC playground uses a general JSONSchema parser to successfully load and interact with this definition. This suggests its the tooling, not the definition, that is the issue.

In contrast, Lotus somewhat omits this definition presumably to avoid this issue:

```json
"ExecutionTrace": {
  "additionalProperties": false,
  "properties": {
    ...
    "Subcalls": {
      "items": {},
      "type": "array"
    }
  },
  ...
},
```

## Additional Observations

**4. We need to define equality.**

In order to assert if two OpenRPC documents are "the same" we need to define equality. For example - if two documents define the same method, but using different names for the parameters are they equivalent?

As a baseline, we might assume these requirements are inherent:

- Methods MUST have the same name
- Methods MUST have the same number of parameters
- Methods MUST have the same schema for each method
- Methods MUST have the same [`param-structure`](https://spec.open-rpc.org/#method-object)
- Methods MUST return a value with the same schema

Some requirements that may be worth discussing:

- Methods MUST have the same ordering of parameters
- Methods MUST use the same names for parameters
- Methods MUST include an example
- Methods MUST include the same example
- Methods MUST include the same description

**5. The Lotus document generally specifies more fields (eg. `deprecated`, `additionalProperties`, `examples`). These may not all be useful, or can be included optionally.**

**6. Both clients use different OpenRPC versions (Forest: 1.3.2, Lotus: 1.2.6). Some tooling doesn't support more recent versions (eg. OpenRPC Playground), so Forest may need to downgrade**

# Recommended Next Steps

- Propose a definition for equality and align with Lotus team
- Improve diff checker to properly handle circular definition, or fail gracefully
- Refine the "spec" to be compatible with both implementations
- Incrementally implement fixes in both Lotus and Forest
