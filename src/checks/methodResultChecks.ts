import {ContentDescriptorObject} from '@open-rpc/meta-schema';
import {MethodResultIssue_Schema, MethodResultIssue_Required, DiffIssue} from '../issues';
import {isDeepStrictEqual} from 'node:util';

type MethodResultCheck = (expected: ContentDescriptorObject, actual: ContentDescriptorObject) => DiffIssue[];

const methodResultCheckRequired = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssue[] => {
  if (expected.required != actual.required) {
    // TODO: What if expected.require is undefined?
    return [new MethodResultIssue_Required(expected.required, actual.required)];
  }

  return [];
};
const methodResultCheckSchema = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssue[] => {
  if (!isDeepStrictEqual(expected.schema, actual.schema)) {
    return [new MethodResultIssue_Schema(expected.schema, actual.schema)];
  }

  return [];
};

export const MethodResultChecks: MethodResultCheck[] = [methodResultCheckRequired, methodResultCheckSchema];
