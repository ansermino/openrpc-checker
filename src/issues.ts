import {
  JSONSchema,
  MethodObjectParamStructure,
  MethodObjectResult,
} from '@open-rpc/meta-schema';

class DiffIssue {
  private readonly msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }

  public toString(): string {
    return `${this.msg}`;
  }
}

// Returned when a method with the expected name does not exist
export class MethodDoesNotExistIssue extends DiffIssue {
  constructor(name: string) {
    super(`Method ${name} not found`);
  }
}

// Returned when the param structure differs
export class MethodParamStructureIssue extends DiffIssue {
  constructor(expected?: MethodObjectParamStructure, actual?: MethodObjectParamStructure) {
    super(`Expected parameter structure ${expected || '(none)'}, got: ${actual || '(none)'}`);
  }
}

// Returned when a method does not have an expected parameter
export class MethodMissingParamIssue extends DiffIssue {
  constructor(expected: string) {
    super(`Parameter ${expected} not found.`);
  }
}

// Returned if a method is required or optional
export class MethodRequiredIssue extends DiffIssue {
  constructor(expected: boolean | undefined, actual: boolean | undefined) {
    super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
  }
}

// Returned if a method schema does not match
export class MethodSchemaIssue extends DiffIssue {
  constructor(expected: JSONSchema, actual: JSONSchema) {
    super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
  }
}

export class MethodResultIssue extends DiffIssue {
  constructor(expected: MethodObjectResult | undefined, actual: MethodObjectResult | undefined) {
    super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
  }
}

export type DiffIssues =
  | MethodDoesNotExistIssue
  | MethodParamStructureIssue
  | MethodMissingParamIssue
  | MethodRequiredIssue
  | MethodSchemaIssue
  | MethodResultIssue;
