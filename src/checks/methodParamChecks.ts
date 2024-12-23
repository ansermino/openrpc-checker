import {ContentDescriptorObject} from '@open-rpc/meta-schema';
import {DiffErrors, MethodRequiredError, MethodSchemaError} from '../errors';
import {isDeepStrictEqual} from 'node:util';

export type MethodParamCheck = (expected: ContentDescriptorObject, actual: ContentDescriptorObject) => DiffErrors[];

const methodParamCheckRequired = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffErrors[] => {
  if (expected.required != actual.required) {
    return [new MethodRequiredError(expected.required, actual.required)];
  }

  return [];
};

const methodParamCheckSchema = (expected: ContentDescriptorObject, actual: ContentDescriptorObject): DiffErrors[] => {
  if (!isDeepStrictEqual(expected.schema, actual.schema)) {
    return [new MethodSchemaError(expected.schema, actual.schema)];
  }

  return [];
};

export const MethodParamChecks: MethodParamCheck[] = [methodParamCheckRequired, methodParamCheckSchema];
