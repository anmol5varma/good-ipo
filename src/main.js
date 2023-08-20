import * as Cheerio from 'cheerio';
import Fetch from "node-fetch";
import { table as Table } from 'table';
import Chalk from 'chalk';

import { IPO_LIST_COLUMN_NAME, IPO_DASHBOARD_URL, IPO_DASHBOARD_ENDPOINT } from './constant.js'

const getRawData = async (url) => {
    return Fetch(url)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

const getSubscriptionDetails = async (link) => {
    const subscriptionsLink = link.replace("/gmp/", "/subscription/").replace("-gmp/", "-subscriptions/")
    const subscriptionPage = await getRawData(IPO_DASHBOARD_URL + subscriptionsLink);
    const $ = Cheerio.load(subscriptionPage);
    const table = $('.tsb-table');
    const cellArray = table.find('tr').last().find('td')

    // length can be 5(sme) or 8(ipo)
    // show RII, NII
    const rowData = { rii: '', nii: '', others: '', total: '' }
    if (cellArray.length === 8) {
        cellArray.each((cellIndex, cell) => {
            if ([3, 4, 5, 6, 7].includes(cellIndex)) {
                const cellData = $(cell).text().trim();
                switch (cellIndex) {
                    case 3: rowData.nii = cellData; break;
                    case 4: rowData.others = 'sNII: ' + cellData; break;
                    case 5: rowData.others += ', bNII: ' + cellData; break;
                    case 6: rowData.rii = cellData; break;
                    case 7: rowData.total = cellData; break;
                    default: rowData = rowData;
                }
            }
        })
    } else if (cellArray.length === 5) {
        cellArray.each((cellIndex, cell) => {
            if ([2, 3, 4].includes(cellIndex)) {
                const cellData = $(cell).text().trim();
                switch (cellIndex) {
                    case 2: rowData.nii = cellData; break;
                    case 3: rowData.rii = cellData; break;
                    case 4: rowData.total = cellData; break;
                    default: rowData = rowData;
                }
            }
        })
    }
    return rowData
}

const scrapeDataFromTable = ($, table) => {
    const data = [];
    table.find('tr').each((rowIndex, row) => {
        const rowData = {};
        $(row).find('td').each((cellIndex, cell) => {
            if ([0, 1, 2, 3, 7, 8].includes(cellIndex)) {
                const cellData = $(cell).text().trim();
                rowData[IPO_LIST_COLUMN_NAME[cellIndex]] = cellData
            }
        })
        if (Object.keys(rowData).length === 6)
            data.push(rowData)
    })
    return data;
}

const scrapeLinkFromTable = ($, table) => {
    const links = [];
    table.find('tr').each((rowIndex, row) => {
        const rowLink = $(row).find('td > a').attr('href');
        if (rowLink)
            links.push(rowLink)
    })
    return links
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

const fetchSubscriptionDetails = async (data) => {
    return Promise.all(data.map(async (ipoEntry, i) => {
        const { link, ...otherDetails } = ipoEntry;
        const subscriptionDetails = await getSubscriptionDetails(link);
        return { ...otherDetails, ...subscriptionDetails };
    }))
}

const printOutput = data => {
    const Headers = Object.keys(data[0]).map(key => key.toUpperCase())
    const tableData = data.map(row => Object.values(row))
    console.log(Chalk.cyan(`Data is fetched from ${IPO_DASHBOARD_URL + IPO_DASHBOARD_ENDPOINT}`));
    console.log(Table([Headers, ...tableData]));
}

const main = async () => {
    const page = await getRawData(IPO_DASHBOARD_URL + IPO_DASHBOARD_ENDPOINT)
    const $ = Cheerio.load(page);
    const table = $('#mainTable');
    const tableData = scrapeDataFromTable($, table);
    const tableLink = scrapeLinkFromTable($, table);
    const data = tableData.map((row, i) => ({ ...row, link: tableLink[i] }))
    const currentIPOs = getCurrentIPOs(data)
    const upcomingIPOs = getUpcomingIPOs(data)
    printOutput(await fetchSubscriptionDetails(currentIPOs.concat(upcomingIPOs)));
}

main();