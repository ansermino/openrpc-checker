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

const printDetails = (results: DiffResults) => {
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
}

const printSummary = (results: DiffResults) => {
  const methods = Object.keys(results);

  console.log(`Validated ${methods.length} methods.`);

  let count = 0;

  for (const m of methods) {

    if (results[m].length != 0) {
      console.log(`❌ Found ${results[m].length == 1 ? "1 issue" : results[m].length + " issues"} with method ${m}`);
      count++
    }
  }

  if (count > 0) {
    console.log(`\n❌ Found ${count} methods with issues. Re-run without "--summary" to see details.`);
  } else {
    console.log(`✅ Found no issues!`);
  }
}

export const printDiff = (results: DiffResults, summary: boolean) => {
  if (summary) {
    printSummary(results)
  } else {
    printDetails(results)
  }
};
