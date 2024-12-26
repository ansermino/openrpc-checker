import {program} from 'commander';
import {parseOpenRPCDocument} from '@open-rpc/schema-utils-js';
import {diff} from './diff.ts';
import {printDiff} from './output.ts';

program.name('openrpc').version('0.0.0').description('');

program
  .command('diff')
  .description('Compare to OpenRPC documents')
  .option('-s, --spec <PATH>', 'Path to spec file')
  .option('-t, --target <PATH>', 'Path to target file')
  .action(async (options) => {
    const spec = await parseOpenRPCDocument(options.spec);
    const target = await parseOpenRPCDocument(options.target);

    console.log(`Loaded spec with ${spec.methods.length} methods`);
    console.log(`Loaded target with ${target.methods.length} methods`);

    const res = diff(spec, target);
    printDiff(res);
  });

program.parse(process.argv);
