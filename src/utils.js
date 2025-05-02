import { table as Table } from 'table';
import Chalk from 'chalk';
import { IPO_DASHBOARD_URL, IPO_DASHBOARD_ENDPOINT } from './constant.js'

export const printOutput = data => {
    const Headers = Object.keys(data[0]).map(key => key.toUpperCase())
    const tableData = data.map(row => {
        const type = row.type === 'IPO' ? Chalk.bgYellow('IPO') : Chalk.bgCyan('SME')
        const close = todayOrTomorrowLastDay(row.close) ? Chalk.bgRed(row.close) : row.close
        row.type = type
        row.close = close
        return Object.values(row)
    })
    console.log(Chalk.cyan(`Data is fetched from ${IPO_DASHBOARD_URL + IPO_DASHBOARD_ENDPOINT}`));
    console.log(Table([Headers, ...tableData]));
}

export const todayOrTomorrowLastDay = closeDate => {
    const currentDate = new Date();
    const closingDate = new Date(closeDate);
    return closingDate.getMonth() === currentDate.getMonth() && closingDate.getDate() - currentDate.getDate() <= 1
}