import {program} from 'commander';
import {checkCmd, diffCmd} from './cmd';

program.name('openrpc').version('0.0.0').description('');

program
  .command('diff')
  .description('Compare to OpenRPC documents')
  .option('-s, --spec <PATH>', 'Path to spec file')
  .option('-t, --target <PATH>', 'Path to target file')
  .option('--ref-parser', 'Use json-schema-ref-parser instead of schema-utils-js', false)
  .action(async (options) => {
    try {
      await diffCmd(options.spec, options.target, options.refParser);
    } catch (e) {
      program.error(e);
    }
  });

program
  .command('check')
  .description('Validate an OpenRPC document')
  .option('-t, --target <PATH>', 'Path to target file')
  .option('--ref-parser', 'Use json-schema-ref-parser instead of schema-utils-js', false)
  .action(async (options) => {
    try {
      await checkCmd(options.target, options.refParser);
    } catch (e) {
      program.error(e.message.toString());
    }
  });

function errorColor(str: string) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

program.configureOutput({
  // Visibly override write routines as example!
  writeOut: (str) => process.stdout.write(`${str}`),
  writeErr: (str) => process.stdout.write(`${str}`),
  // Highlight errors in color.
  outputError: (str, write) => write(errorColor(str)),
});

program.parse(process.argv);
