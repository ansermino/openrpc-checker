import {
  OpenrpcDocument,
  MethodObject,
  MethodOrReference,
  MethodObjectParams,
  ContentDescriptorOrReference,
  ContentDescriptorObject,
} from '@open-rpc/meta-schema';
import {
  MethodDoesNotExistErr,
  MethodParamStructureErr,
  DiffErrors,
  MethodMissingParam,
  MethodRequiredError,
  MethodSchemaError,
  ResultError,
} from './errors';
import {isDeepStrictEqual} from 'node:util';

export type DiffResults = {
  [key: string]: DiffErrors[];
};

export type MethodMap = {
  [key: string]: MethodObject;
};

export const isMethod = (x: MethodOrReference): x is MethodObject => {
  return (x as MethodObject).name !== undefined;
};

const isContentDescriptor = (x: ContentDescriptorOrReference): x is ContentDescriptorObject => {
  return (x as ContentDescriptorObject).name !== undefined;
};

const getMethodName = (m: MethodOrReference): string => {
  if (isMethod(m)) {
    return m.name;
  } else {
    throw new Error('Unexpected reference to method');
  }
};

const getMethodParam = (name: string, params: MethodObjectParams): ContentDescriptorObject | null => {
  for (const p of params) {
    if (isContentDescriptor(p)) {
      if (p.name == name) {
        return p as ContentDescriptorObject;
      }
    } else {
      throw new Error('Unexpected reference to method param');
    }
  }
  return null;
};

// Returns a map of method name => method object
export const createMethodMap = (methods: MethodOrReference[]): MethodMap => {
  let map: MethodMap = {};
  methods.forEach((m) => {
    if (isMethod(m)) {
      map[m.name] = m;
    } else {
      throw new Error('Unexpected reference to method');
    }
  });

  return map;
};

export const diff = (expected: OpenrpcDocument, actual: OpenrpcDocument): DiffResults => {
  let methodsExpected: MethodMap = createMethodMap(expected.methods);
  let methodsActual: MethodMap = createMethodMap(actual.methods);
  const methodNames = expected.methods.map((m) => getMethodName(m));

  const res: DiffResults = {};

  for (const m of methodNames) {
    res[m] = methodDiff(m, methodsExpected, methodsActual);
  }

  return res;
};

export const methodDiff = (method: string, expected: MethodMap, actual: MethodMap): DiffErrors[] => {
  const expMethod = expected[method];
  const actMethod = actual[method];

  const errs = [];

  if (expMethod === undefined) {
    return [new MethodDoesNotExistErr(method)];
  }

  if (actMethod === undefined) {
    return [new MethodDoesNotExistErr(method)];
  }

  if (actMethod.paramStructure != expMethod.paramStructure) {
    errs.push(new MethodParamStructureErr(expMethod.paramStructure, actMethod.paramStructure));
  }

  expMethod.params.forEach((p) => {
    const expectedParam = p as ContentDescriptorObject;
    // Take all expected params and put them in an array
    const actualParam = getMethodParam(expectedParam.name, actMethod.params);

    if (actualParam === null) {
      errs.push(new MethodMissingParam(expectedParam.name));
      return;
    }

    if (expectedParam.required != actualParam.required) {
      errs.push(new MethodRequiredError(expectedParam.required, actualParam.required));
    }

    if (!isDeepStrictEqual(expectedParam.schema, actualParam.schema)) {
      errs.push(new MethodSchemaError(expectedParam.schema, actualParam.schema));
    }
  });

  const expResult = expMethod.result;
  const actResult = actMethod.result;

  if (!isDeepStrictEqual(expResult, actResult)) {
    errs.push(new ResultError(expResult, actResult));
  }

  return errs;
};
