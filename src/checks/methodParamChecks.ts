import {ContentDescriptorObject} from '@open-rpc/meta-schema';
import {DiffIssue} from "../issues/issue.ts";
import {MethodParamIssue_Required, MethodParamIssue_Schema} from '../issues/methodParams.ts';
import {isDeepStrictEqual} from 'node:util';

export type MethodParamCheck = (expected: ContentDescriptorObject, actual: ContentDescriptorObject) => DiffIssue[];

const methodParamCheckRequired = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssue[] => {
  if (expected.required != actual.required) {
    // TODO: What if expected.require is undefined?
    return [new MethodParamIssue_Required(expected.required)];
  }

  return [];
};

const methodParamCheckSchema = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffIssue[] => {
  if (!isDeepStrictEqual(expected.schema, actual.schema)) {
    return [new MethodParamIssue_Schema(expected.schema, actual.schema)];
  }

  return [];
};

export const MethodParamChecks: MethodParamCheck[] = [methodParamCheckRequired, methodParamCheckSchema];
