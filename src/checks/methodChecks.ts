import {MethodObject} from '@open-rpc/meta-schema';
import {MethodIssue_ParamStructure} from '../issues/method.ts';
import {DiffIssue} from "../issues/issue.js";

type MethodCheck = (expected: MethodObject, actual: MethodObject) => DiffIssue[];

const methodCheckParamStructure = (expected: MethodObject, actual: MethodObject): DiffIssue[] => {
  if (expected.paramStructure != actual.paramStructure) {
    return [new MethodIssue_ParamStructure(expected.paramStructure, actual.paramStructure)];
  }

  return [];
};

export const MethodChecks: MethodCheck[] = [methodCheckParamStructure];
