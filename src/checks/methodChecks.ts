import {MethodObject} from '@open-rpc/meta-schema';
import {DiffErrors, MethodParamStructureErr} from '../errors';

type MethodCheck = (expected: MethodObject, actual: MethodObject) => DiffErrors[];

const methodCheckParamStructure = (expected: MethodObject, actual: MethodObject): DiffErrors[] => {
  if (expected.paramStructure != actual.paramStructure) {
    return [new MethodParamStructureErr(expected.paramStructure, actual.paramStructure)];
  }

  return [];
};

export const MethodChecks: MethodCheck[] = [methodCheckParamStructure];
