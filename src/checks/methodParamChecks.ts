import {ContentDescriptorObject} from '@open-rpc/meta-schema';
import {DiffIssues, MethodRequiredIssue, MethodSchemaIssue} from '../issues';
import {isDeepStrictEqual} from 'node:util';

export type MethodParamCheck = (expected: ContentDescriptorObject, actual: ContentDescriptorObject) => DiffIssues[];

const methodParamCheckRequired = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssues[] => {
  if (expected.required != actual.required) {
    return [new MethodRequiredIssue(expected.required, actual.required)];
  }

  return [];
};

const methodParamCheckSchema = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssues[] => {
  if (!isDeepStrictEqual(expected.schema, actual.schema)) {
    return [new MethodSchemaIssue(expected.schema, actual.schema)];
  }

  return [];
};

export const MethodParamChecks: MethodParamCheck[] = [methodParamCheckRequired, methodParamCheckSchema];
