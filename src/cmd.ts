import {parseOpenRPCDocument} from '@open-rpc/schema-utils-js';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import {OpenrpcDocument} from '@open-rpc/meta-schema';
import {diff} from './diff';
import {printDiff} from './output';

export const diffCmd = async (spec: string, target: string, refParser: boolean, summary: boolean) => {
  let specDoc: OpenrpcDocument;
  let targetDoc: OpenrpcDocument;

  if (refParser) {
    specDoc = (await $RefParser.dereference(spec)) as OpenrpcDocument;
    targetDoc = (await $RefParser.dereference(target)) as OpenrpcDocument;
  } else {
    specDoc = await parseOpenRPCDocument(spec);
    targetDoc = await parseOpenRPCDocument(target);
  }

  console.log(`Loaded spec from ${spec} with ${specDoc.methods.length} methods`);
  console.log(`Loaded target from ${target} with ${targetDoc.methods.length} methods`);


  const res = diff(specDoc, targetDoc);
  printDiff(res, summary);
};

export const checkCmd = async (target: string, refParser: boolean) => {
  let targetDoc: OpenrpcDocument;

  if (refParser) {
    targetDoc = (await $RefParser.dereference(target)) as OpenrpcDocument;
  } else {
    targetDoc = await parseOpenRPCDocument(target);
  }

  console.log(`Successfully loaded ${targetDoc.methods.length} methods from ${target}`);
};
