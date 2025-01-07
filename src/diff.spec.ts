import {parseOpenRPCDocument} from '@open-rpc/schema-utils-js';
import {createMethodMap, isMethod, methodDiff} from './diff';
import {ContentDescriptorObject, MethodObject, MethodOrReference, OpenrpcDocument} from '@open-rpc/meta-schema';
import {todo} from 'node:test';
import {
  MethodIssue_MissingMethod,
  MethodIssue_ParamStructure,
  MethodParamIssue_MissingParam,
  MethodResultIssue_Required,
  MethodResultIssue_Schema,
} from './issues';

// Returns a MethodMap containing only the method at index i
const createTestMethodMap = (methods: MethodOrReference[], target: string) => {
  const res = methods.filter((m) => {
    return isMethod(m) && m.name == target;
  });

  return createMethodMap(res);
};

describe('compare methods', () => {
  let referenceDoc: OpenrpcDocument;
  let testDoc: OpenrpcDocument;

  beforeAll(async () => {
    referenceDoc = await parseOpenRPCDocument('./tests/unit-tests/valid.json');
    testDoc = await parseOpenRPCDocument('./tests/unit-tests/test.json');
  });

  it('should consider two identical methods as the same', () => {
    const METHOD = 'ValidMethod';

    const ref = createTestMethodMap(referenceDoc.methods, METHOD);
    const test = createTestMethodMap(testDoc.methods, METHOD);

    const res = methodDiff(METHOD, ref, test);

    expect(res).toHaveLength(0);
  });

  it('should report an issue if a method only exists in one document', () => {
    const METHOD = 'MissingMethod';
    // Use full method map to check missing method
    const ref = createMethodMap(referenceDoc.methods);
    const test = createMethodMap(testDoc.methods);

    const res = methodDiff(METHOD, ref, test);

    const expected = [new MethodIssue_MissingMethod(METHOD)];

    expect(res).toHaveLength(1);
    expect(res).toEqual(expected);
  });
  it('should report an issue if a method has a different parameters', () => {
    const METHOD = 'DifferentParams';
    const ref = createTestMethodMap(referenceDoc.methods, METHOD);
    const test = createTestMethodMap(testDoc.methods, METHOD);

    const expectedParamName = (ref[METHOD].params[0] as ContentDescriptorObject).name;

    const res = methodDiff(METHOD, ref, test);

    const expected = [new MethodParamIssue_MissingParam(expectedParamName)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodParamIssue_MissingParam);
    expect(res).toEqual(expected);
  });

  it('should report an issue if a method has a different parameter schema', () => {
    todo();
  });

  it('should report an issue if a method has different param structure', () => {
    const METHOD = 'DifferentParamStructure';

    const ref = createTestMethodMap(referenceDoc.methods, METHOD);
    const test = createTestMethodMap(testDoc.methods, METHOD);

    const methodName: string = Object.keys(ref)[0];
    const expectedStructure = (ref[methodName] as MethodObject).paramStructure;

    const res = methodDiff(methodName, ref, test);

    const expected = [new MethodIssue_ParamStructure(expectedStructure, undefined)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodIssue_ParamStructure);
    expect(res).toEqual(expected);
  });

  it('should report an issue if the method result is/not required ', () => {
    const METHOD = 'DifferentResultRequired';

    const ref = createTestMethodMap(referenceDoc.methods, METHOD);
    const test = createTestMethodMap(testDoc.methods, METHOD);
    const methodName: string = Object.keys(ref)[0];

    const res = methodDiff(methodName, ref, test);

    const expectedReq = (ref[METHOD].result as ContentDescriptorObject).required;
    const actualReq = (test[METHOD].result as ContentDescriptorObject).required;
    const expectedIssue = [new MethodResultIssue_Required(expectedReq, actualReq)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodResultIssue_Required);
    expect(res).toEqual(expectedIssue);
  });

  it('should report an issue if the method result schema is different ', () => {
    const METHOD = 'DifferentResultSchema';

    const ref = createTestMethodMap(referenceDoc.methods, METHOD);
    const test = createTestMethodMap(testDoc.methods, METHOD);
    const methodName: string = Object.keys(ref)[0];

    const res = methodDiff(methodName, ref, test);

    const expectedSchema = (ref[METHOD].result as ContentDescriptorObject).schema;
    const actualSchema = (test[METHOD].result as ContentDescriptorObject).schema;

    const expectedIssue = [new MethodResultIssue_Schema(expectedSchema, actualSchema)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodResultIssue_Schema);
    expect(res).toEqual(expectedIssue);
  });
});
