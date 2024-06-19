import * as Cheerio from 'cheerio';
import Fetch from "node-fetch";
import { table as Table } from 'table';
import Chalk from 'chalk';

import { IPO_LIST_COLUMN_NAME, IPO_DASHBOARD_URL, IPO_DASHBOARD_ENDPOINT } from './constant.js'

const isCliTrigger = true

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
    const cellTitle = table.find('tr').first().find('th')
    const cellArray = table.find('tr').last().find('td')

    const titles = new Array(cellTitle.length)

    cellTitle.each((index, cell) => {
        titles[index] = $(cell).text().trim()
    })

    // need to define this object so columns are same in the table log
    const rowData = { qib: '', nii: '', rii: '', others: '', total: '' }
    const KEY_LIST = ['SNII', 'BNII', 'RII', 'NII', 'QIB', 'Total']

    cellArray.each((cellIndex, cell) => {
        const cellData = $(cell).text().trim();
        const titleKey = KEY_LIST.find(val => titles[cellIndex]?.includes(val))
        if (titleKey)
            rowData[titleKey.toLowerCase()] = cellData
    })

    if (rowData.snii || rowData.bnii) {
        rowData.others = `sNII: ${rowData.snii}, bNII: ${rowData.bnii}`
        delete rowData.snii
        delete rowData.bnii
    }
    console.log(rowData);
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
        const { link, name, ...otherDetails } = ipoEntry;
        const subscriptionDetails = await getSubscriptionDetails(link);
        const type = name.includes('IPO') ? Chalk.bgYellow('IPO') : name.includes('SME') ? Chalk.bgCyan('SME') : ''
        if (isCliTrigger)
            return { name, type, ...otherDetails, ...subscriptionDetails };
        else
            return { name, type, link: IPO_DASHBOARD_URL + link.replace("/gmp/", "/subscription/").replace("-gmp/", "-subscriptions/"), ...otherDetails, ...subscriptionDetails };
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
    const subscriptionData = await fetchSubscriptionDetails(currentIPOs.concat(upcomingIPOs))
    if (isCliTrigger)
        printOutput(subscriptionData);
    else
        return subscriptionData;
}

if (isCliTrigger)
    main();

export default main;