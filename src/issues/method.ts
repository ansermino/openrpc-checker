import {DiffIssue} from './index';
import {MethodObjectParamStructure} from '@open-rpc/meta-schema';

// Returned when a method with the expected name does not exist
export class MethodIssue_MissingMethod extends DiffIssue {
  constructor(name: string) {
    super(`Method ${name} not found`);
  }
}

// Returned when the param structure field differs
export class MethodIssue_ParamStructure extends DiffIssue {
  constructor(expected?: MethodObjectParamStructure, actual?: MethodObjectParamStructure) {
    super(`Expected parameter structure ${expected || '(none)'}, got: ${actual || '(none)'}`);
  }
}
