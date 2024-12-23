import {ContentDescriptorObject, JSONSchema, MethodObjectParamStructure, MethodObjectResult} from "@open-rpc/meta-schema";

class DiffError {
    private msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    public toString(): string {
        return `${this.msg}`;
    }
}


// Returned when a method with the expected name does not exist
export class MethodDoesNotExistErr extends DiffError {
        constructor(name: string) {
        super(`Method ${name} not found`);
    }
}

// Returned when the param structure differs
export class MethodParamStructureErr extends DiffError {
    constructor(expected?: MethodObjectParamStructure, actual?: MethodObjectParamStructure) {
        super(`Expected parameter structure ${expected || "(none)"}, got: ${actual || "(none)"}`);
    }
}

// Returned when a method does not have an expected parameter
export class MethodMissingParam extends DiffError {
    constructor(expected: string) {
        super(`Parameter ${expected} not found.`);
    }
}

// Returned if a method is required or optional
export class MethodRequiredError extends DiffError {
    constructor(expected: boolean | undefined, actual: boolean | undefined) {
        super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
    }
}

// Returned if a method schema does not match
export class MethodSchemaError extends DiffError {
    constructor(expected: JSONSchema, actual: JSONSchema) {
        super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
    }
}

export class ResultError extends DiffError {
    constructor(expected: MethodObjectResult | undefined, actual: MethodObjectResult | undefined) {
        super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
    }
}

export type DiffErrors = MethodDoesNotExistErr | MethodParamStructureErr | MethodMissingParam | MethodRequiredError | MethodSchemaError | ResultError;
