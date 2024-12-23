import {parseOpenRPCDocument} from '@open-rpc/schema-utils-js';
import {createMethodMap, diff, isMethod, methodDiff, MethodMap} from './diff';
import {ContentDescriptorObject, MethodObject, MethodOrReference, OpenrpcDocument} from '@open-rpc/meta-schema';
import {MethodDoesNotExistErr, MethodMissingParam, MethodParamStructureErr, ResultError} from './errors';

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
    referenceDoc = await parseOpenRPCDocument('./tests/validation-checks/valid.json');
    testDoc = await parseOpenRPCDocument('./tests/validation-checks/test.json');
  });

  it('should consider two identical methods as the same', () => {
    const METHOD = 'ValidMethod';

    let ref = createTestMethodMap(referenceDoc.methods, METHOD);
    let test = createTestMethodMap(testDoc.methods, METHOD);

    const res = methodDiff(METHOD, ref, test);

    expect(res).toHaveLength(0);
  });

  it('should return an error if a method only exists in one document', () => {
    const METHOD = 'MissingMethod';
    // Use full method map to check missing method
    let ref = createMethodMap(referenceDoc.methods);
    let test = createMethodMap(testDoc.methods);

    const res = methodDiff(METHOD, ref, test);

    const expected = [new MethodDoesNotExistErr(METHOD)];

    expect(res).toHaveLength(1);
    expect(res).toEqual(expected);
  });
  it('should return an error if a method has a different parameters', () => {
    const METHOD = 'DifferentParams';
    let ref = createTestMethodMap(referenceDoc.methods, METHOD);
    let test = createTestMethodMap(testDoc.methods, METHOD);

    const expectedParamName = (ref[METHOD].params[0] as ContentDescriptorObject).name;

    const res = methodDiff(METHOD, ref, test);

    const expected = [new MethodMissingParam(expectedParamName)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodMissingParam);
    expect(res).toEqual(expected);
  });

  it('should return an error if a method has different param structure', () => {
    const METHOD = 'DifferentParamStructure';

    let ref = createTestMethodMap(referenceDoc.methods, METHOD);
    let test = createTestMethodMap(testDoc.methods, METHOD);

    const methodName: string = Object.keys(ref)[0];
    const expectedParamName = (ref[methodName].params[0] as ContentDescriptorObject).name;

    const res = methodDiff(methodName, ref, test);

    const expected = [new MethodParamStructureErr('by-position', undefined)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(MethodParamStructureErr);
    expect(res).toEqual(expected);
  });

  it('should return an error if the result is different ', () => {
    const METHOD = 'DifferentResult';

    let ref = createTestMethodMap(referenceDoc.methods, METHOD);
    let test = createTestMethodMap(testDoc.methods, METHOD);

    const methodName: string = Object.keys(ref)[0];

    const res = methodDiff(methodName, ref, test);

    const expected = [new ResultError(ref[METHOD].result, test[METHOD].result)];

    expect(res).toHaveLength(1);
    expect(res[0]).toBeInstanceOf(ResultError);
    expect(res).toEqual(expected);
  });
});
