import * as Cheerio from 'cheerio';
import Fetch from "node-fetch";
import { table as Table } from 'table';
import Chalk from 'chalk';

import { COLUMN_NAME, IPO_DAHBOARD_URL } from './constant.js'

const getRawData = async (url) => {
    return Fetch(url)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

const scrapeDataFromTable = ($, table) => {
    const data = [];
    table.find('tr').each((rowIndex, row) => {
        const rowData = {};
        $(row).find('td').each((cellIndex, cell) => {
            if ([0, 1, 2, 3, 7, 8].includes(cellIndex)) {
                const cellData = $(cell).text().trim();
                rowData[COLUMN_NAME[cellIndex]] = cellData
            }
        })
        if (Object.keys(rowData).length === 6)
            data.push(rowData)
    })
    return data;
}

const todayOrTomorrowLastDay = closeDate => {
    const currentDate = new Date();
    const closingDate = new Date(closeDate);
    return closingDate.getMonth() === currentDate.getMonth() && closingDate.getDate() - currentDate.getDate() <= 1
}

const getCurrentIPOs = (data) => {
    return data
        .filter(({ name }) => name.endsWith('Open') || name.includes('Closing Today') || name.includes('Open ('))
        .map((ipo) => {
            if (todayOrTomorrowLastDay(ipo.close))
                return { ...ipo, close: Chalk.bgRed(ipo.close) }
            return { ...ipo }
        })
        .sort((a, b) => new Date(a.open) - new Date(b.close))
}

const getUpcomingIPOs = (data) => {
    return data
        .filter(({ name }) => name.endsWith('Upcoming'))
        .sort((a, b) => new Date(a.open) - new Date(b.close))
}

const printOutput = data => {
    const Headers = Object.keys(data[0]).map(key => key.toUpperCase())
    const tableData = data.map(row => Object.values(row))
    console.log(Chalk.cyan(`Data is fetched from ${IPO_DAHBOARD_URL}`));
    console.log(Table([Headers, ...tableData]));
}

const main = async () => {
    const page = await getRawData(IPO_DAHBOARD_URL)
    const $ = Cheerio.load(page);
    const table = $('#mainTable');
    const tableData = scrapeDataFromTable($, table);
    const currentIPOs = getCurrentIPOs(tableData)
    const upcomingIPOs = getUpcomingIPOs(tableData)
    printOutput(currentIPOs.concat(upcomingIPOs));
}

main();