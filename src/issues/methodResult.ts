import {ContentDescriptorObjectRequired, JSONSchema} from '@open-rpc/meta-schema';
import {DiffIssue} from './issue';

export class MethodResultIssue_Required extends DiffIssue {
  constructor(
    expected: ContentDescriptorObjectRequired | undefined,
    actual: ContentDescriptorObjectRequired | undefined,
  ) {
    super(`Method result ${expected ? 'should' : "shouldn't"} be required. Actual: ${actual}`);
  }
}

export class MethodResultIssue_Schema extends DiffIssue {
  constructor(expected: JSONSchema, actual: JSONSchema) {
    super(`Expected:\n ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}
