import {
  OpenrpcDocument,
  MethodObject,
  MethodOrReference,
  MethodObjectParams,
  ContentDescriptorOrReference,
  ContentDescriptorObject,
} from '@open-rpc/meta-schema';
import {MethodChecks} from './checks/methodChecks';
import {MethodParamChecks} from './checks/methodParamChecks';
import {MethodResultChecks} from './checks/methodResultChecks';
import {DiffIssue, MethodIssue_MissingMethod, MethodParamIssue_MissingParam} from './issues';

export type DiffResults = {
  [key: string]: DiffIssue[];
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
  const map: MethodMap = {};
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
  const methodsExpected: MethodMap = createMethodMap(expected.methods);
  const methodsActual: MethodMap = createMethodMap(actual.methods);
  const methodNames = expected.methods.map((m) => getMethodName(m));

  const res: DiffResults = {};

  for (const m of methodNames) {
    res[m] = methodDiff(m, methodsExpected, methodsActual);
  }

  return res;
};

export const methodDiff = (method: string, expected: MethodMap, actual: MethodMap): DiffIssue[] => {
  const expMethod = expected[method];
  const actMethod = actual[method];

  const issues: DiffIssue[] = [];

  if (expMethod === undefined) {
    throw new Error('Unexpected reference to method');
  }

  if (actMethod === undefined) {
    return [new MethodIssue_MissingMethod(method)];
  }

  for (const c of MethodChecks) {
    issues.push(...c(expMethod, actMethod));
  }

  expMethod.params.forEach((p) => {
    const expectedParam = p as ContentDescriptorObject;
    const actualParam = getMethodParam(expectedParam.name, actMethod.params);

    if (actualParam === null) {
      issues.push(new MethodParamIssue_MissingParam(expectedParam.name));
      return;
    }

    for (const c of MethodParamChecks) {
      issues.push(...c(expectedParam, actualParam));
    }
  });

  for (const c of MethodResultChecks) {
    issues.push(...c(expMethod.result as ContentDescriptorObject, actMethod.result as ContentDescriptorObject));
  }

  return issues;
};
