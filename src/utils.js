import { table as Table } from 'table';
import Chalk from 'chalk';
import { IPO_DASHBOARD_URL, IPO_DASHBOARD_ENDPOINT } from './constant.js'

export const printOutput = data => {
    const Headers = Object.keys(data[0]).map(key => key.toUpperCase())
    const tableData = data.map(row => Object.values(row))
    console.log(Chalk.cyan(`Data is fetched from ${IPO_DASHBOARD_URL + IPO_DASHBOARD_ENDPOINT}`));
    console.log(Table([Headers, ...tableData]));
}

export const todayOrTomorrowLastDay = closeDate => {
    const currentDate = new Date();
    const closingDate = new Date(closeDate);
    return closingDate.getMonth() === currentDate.getMonth() && closingDate.getDate() - currentDate.getDate() <= 1
}