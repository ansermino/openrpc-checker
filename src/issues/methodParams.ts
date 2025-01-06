import {JSONSchema} from '@open-rpc/meta-schema';
import {DiffIssue} from './index';
import {detailedDiff} from 'deep-object-diff';

// Returned when a method does not have an expected parameter
export class MethodParamIssue_MissingParam extends DiffIssue {
  constructor(expected: string) {
    super(`Missing parameter \`${expected}\``);
  }
}

// Returned if a method is required or optional
export class MethodParamIssue_Required extends DiffIssue {
  constructor(expected: boolean | undefined, actual: boolean | undefined) {
    super(`Method param ${expected ? 'should' : "shouldn't"} be required (actual: ${actual})`);
  }
}

// Returned if a method schema does not match
export class MethodParamIssue_Schema extends DiffIssue {
  constructor(expected: JSONSchema, actual: JSONSchema) {
    const d = detailedDiff(expected as object, actual as object);
    super(`Incorrect param schema:\nDiff:\n  ${JSON.stringify(d, null, 2)}`);
  }
}
