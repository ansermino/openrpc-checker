import {JSONSchema} from '@open-rpc/meta-schema';
import {DiffIssue} from './issue';

// Returned when a method does not have an expected parameter
export class MethodParamIssue_MissingParam extends DiffIssue {
  constructor(expected: string) {
    super(`Parameter ${expected} not found.`);
  }
}

// Returned if a method is required or optional
export class MethodParamIssue_Required extends DiffIssue {
  constructor(expected: boolean | undefined) {
    super(`Method ${expected ? 'should' : "shouldn't"} be required`);
  }
}

// Returned if a method schema does not match
export class MethodParamIssue_Schema extends DiffIssue {
  constructor(expected: JSONSchema, actual: JSONSchema) {
    super(`Expected:\n${JSON.stringify(expected, null, 2)}\n Actual: ${JSON.stringify(actual, null, 2)}`);
  }
}
