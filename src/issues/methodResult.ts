import {ContentDescriptorObjectRequired, JSONSchema} from '@open-rpc/meta-schema';
import {DiffIssue} from './index';
import {diff} from 'deep-object-diff';

export class MethodResultIssue_Required extends DiffIssue {
  constructor(
    expected: ContentDescriptorObjectRequired | undefined,
    actual: ContentDescriptorObjectRequired | undefined,
  ) {
    super(`Method result ${expected ? 'should' : "shouldn't"} be required (actual: ${actual})`);
  }
}

export class MethodResultIssue_Schema extends DiffIssue {
  constructor(expected: JSONSchema, actual: JSONSchema) {
    const d = diff(expected as object, actual as object);
    super(`Incorrect result schema:\nDiff:\n  ${JSON.stringify(d, null, 2)}`);
  }
}
