import axios from 'axios';
import { IPO_BACKEND_URL, IPO_DASHBOARD_URL } from './constant.js'

const IPO_STATUS = {
    UPCOMING: 'Upcoming',
    OPEN: 'Open',
    CLOSED: 'Closed'
}

const getIPOStatus = (startDate, endDate) => {
    if(!startDate || !endDate) {
        return '';
    }
    const now = new Date();
    const start = new Date(startDate+`T00:00:00Z`);
    const end = new Date(endDate+`T18:29:59Z`);
    return now < start ? IPO_STATUS.UPCOMING :
        now >= start && now <= end ? IPO_STATUS.OPEN :
        now > end ? IPO_STATUS.CLOSED : '';
}

const transformData = (data) => data.reduce((acc, e) => {
    try {
        const status = getIPOStatus(e['~Srt_Open'], e['~Srt_Close']);
        if ([IPO_STATUS.CLOSED].includes(status))
            return acc

        return acc.concat({
            id: e['~id'],
            name: extractStringFromHTML(e['Name']),
            type: e['~IPO_Category'],
            price: e['Price'],
            gmp: extractStringFromHTML(e['GMP']),
            listing: extractStringFromHTML(e['Listing']),
            open: e['Open'],
            close: e['Close'],
            status,
            link: IPO_DASHBOARD_URL + e['~urlrewrite_folder_name'],
            last_update: e['GMP Updated'],
        })
    } catch (error) {
        return acc;
    }
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

    return { ...ipo, nii: latestSubscriptionData?.nii ?? '-', rii: latestSubscriptionData?.rii ?? '-', qib: latestSubscriptionData?.qib ?? '-', total: latestSubscriptionData?.total ?? '-' }
}

const main = async () => {
    const list = await getIPOList()
    return Promise.all(list.map(getSubscriptionDetails))
}

export default main;