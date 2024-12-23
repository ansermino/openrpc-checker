import {MethodObject} from '@open-rpc/meta-schema';
import {DiffIssues, MethodParamStructureIssue, MethodResultIssue} from '../issues';
import {isDeepStrictEqual} from "node:util";

type MethodCheck = (expected: MethodObject, actual: MethodObject) => DiffIssues[];

const methodCheckParamStructure = (expected: MethodObject, actual: MethodObject): DiffIssues[] => {
  if (expected.paramStructure != actual.paramStructure) {
    return [new MethodParamStructureIssue(expected.paramStructure, actual.paramStructure)];
  }

  return [];
};

const methodCheckResult = (expected: MethodObject, actual: MethodObject): DiffIssues[] => {
  if (!isDeepStrictEqual(expected.result, actual.result)) {
    return [new MethodResultIssue(expected.result, actual.result)];
  }

  return []
}

export const MethodChecks: MethodCheck[] = [methodCheckParamStructure, methodCheckResult];
