import {DiffResults} from "./diff"
import { Table } from "console-table-printer"


export const printDiff = (results: DiffResults) => {
    const methods = Object.keys(results)

    console.log(`Validated ${methods.length} methods.`)

    const table = new Table({
        columns: [
            { name: "Method", alignment: "left" },
            { name: "Issues", alignment: "left" },
        ],
    })

    for (const m of methods) {
        console.log(m)
        if (results[m].length == 0) {
            table.addRow({Method: m, Issues: `✅ No issues with ${m}`}, { color: "green" })
        } else {
            table.addRow({Method: m, Issues: results[m]}, { color: "red" })
        }
    }

    table.printTable()

}

