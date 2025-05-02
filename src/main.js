import axios from 'axios';
import { IPO_BACKEND_URL, IPO_DASHBOARD_URL } from './constant.js'
import Chalk from 'chalk';
import { todayOrTomorrowLastDay } from './utils.js';

const transformData = (data) => data.reduce((acc, e) => {

    const status = extractStringFromHTML(e['Status'])
    const type = e['~IPO_Category'] === 'IPO' ? Chalk.bgYellow('IPO') : Chalk.bgCyan('SME')

    if (!status || status.startsWith('Close'))
        return acc

    const close = todayOrTomorrowLastDay(e['Close']) ? Chalk.bgRed(e['Close']) : e['Close']
        

    return acc.concat({
        id: e['~id'],
        name: e['IPO'],
        type: type,
        price: e['Price'],
        gmp: extractStringFromHTML(e['GMP']),
        listing: extractStringFromHTML(e['Est Listing']),
        open: e['Open'],
        close,
        status: status,
        link: IPO_DASHBOARD_URL + e['~urlrewrite_folder_name'],
        last_update: e['GMP Updated'],
    })
}, [])

const extractStringFromHTML = html => (html.match(/>(.*?)</)?.[1] || '').trim()

const generateUrl = () => {
    const now = new Date();

    const day = now.getDate();             // no padding
    const month = now.getMonth() + 1;      // no padding
    const year = now.getFullYear();
    const nextYear = (year + 1).toString().slice(-2);  // get last 2 digits

    const financialYear = `${year}-${nextYear}`;

    const dateString = `${day}/${month}/${year}/${financialYear}`;
    return `${IPO_BACKEND_URL}/report/data-read/331/${dateString}/0/all`;

}

const getIPOList = async () => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: generateUrl(),
        headers: {
            'accept': 'application/json, text/plain, */*',
        }
    };

    const response = await axios.request(config)

    return transformData(response?.data?.reportTableData ?? [])
}

const getSubscriptionDetails = async (ipo) => {
    if (ipo.status === "Upcoming")
        return { ...ipo, nii: '-', rii: '-', qib: '-', total: '-' }
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${IPO_BACKEND_URL}/ipo/ipo-subscription-read/${ipo.id}`,
        headers: {
            'accept': 'application/json, text/plain, */*',
        }
    };

    const response = await axios.request(config)
    const subscriptionData = response?.data?.data?.ipoBiddingData
    const latestSubscriptionData = subscriptionData[subscriptionData.length - 1]

    return { ...ipo, nii: latestSubscriptionData.nii, rii: latestSubscriptionData.rii, qib: latestSubscriptionData.qib, total: latestSubscriptionData.total }
}

const main = async () => {
    const list = await getIPOList()
    const res = []
    return Promise.all(list.map(getSubscriptionDetails))
}

export default main;