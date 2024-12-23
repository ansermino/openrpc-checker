import {ContentDescriptorObjectRequired, JSONSchema, MethodObjectResult} from "@open-rpc/meta-schema";
import {DiffIssue} from "./index";

export class MethodResultIssue_Required extends DiffIssue {
    constructor(expected: ContentDescriptorObjectRequired | undefined, actual: ContentDescriptorObjectRequired | undefined) {
        super(`Method result ${expected ? "should" : "shouldn't"} be required`);
    }
}

export class MethodResultIssue_Schema extends DiffIssue {
    constructor(expected: JSONSchema, actual: JSONSchema) {
        super(`Expected: ${expected}, got: ${actual}`); // TODO: Improve message
    }
}