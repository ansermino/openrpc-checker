import {DiffResults} from './diff';
import {Table} from 'console-table-printer';
import {DiffIssue} from './issues';

const formatIssues = (issues: DiffIssue[]): string => {
  let res = '';

  for (const i of issues) {
    res = res.concat('- ', i.toString(), '\n');
  }

  return res;
};

export const printDiff = (results: DiffResults) => {
  const methods = Object.keys(results);

  console.log(`Validated ${methods.length} methods.`);

  let count = 0;

  for (const m of methods) {
    const table = new Table({
      columns: [
        {name: 'Method', alignment: 'left'},
        {name: 'Issues', alignment: 'left', minLen: 80},
      ],
    });

    if (results[m].length == 0) {
      table.addRow({Method: m, Issues: `✅ No issues with ${m}`}, {color: 'green'});
    } else {
      table.addRow({Method: m, Issues: formatIssues(results[m])}, {color: 'red'});
      count++;
    }
    table.printTable();
  }

  if (count > 0) {
    console.log(`❌ Found ${count} methods with issues`);
  } else {
    console.log(`✅ Found no issues!`);
  }
};
