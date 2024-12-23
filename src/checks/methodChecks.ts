import {MethodObject} from '@open-rpc/meta-schema';
import {MethodIssue_ParamStructure} from '../issues';

type MethodCheck = (expected: MethodObject, actual: MethodObject) => any[];

const methodCheckParamStructure = (expected: MethodObject, actual: MethodObject): any[] => {
  if (expected.paramStructure != actual.paramStructure) {
    return [new MethodIssue_ParamStructure(expected.paramStructure, actual.paramStructure)];
  }

  return [];
};

export const MethodChecks: MethodCheck[] = [methodCheckParamStructure];
