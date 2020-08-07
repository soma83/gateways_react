import moment from 'moment';

export function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export default function request(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON);
}

export function ipvalidator(ip) {
    return /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(ip);
}

export function validateSerialExists(gateways, gateway, serial) {
    return gateways.find(x => (!gateway && x.serial === serial) || (gateway && gateway.id !== x.id && x.serial === serial));
}

export function validateUidExists(devices, device, uid) {
    return devices.find(x => (!device && +x.uid === uid) || (device && device.id !== x.id && +x.uid === uid));
}

export function getUnique() {
    // return new Date().getTime().toString() + window.crypto.getRandomValues(new Uint32Array(1))[0];
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
}

export function getStringAsDate(date) {
    const dateAsMoment = moment(date, 'YYYY-MM-DD');
    return dateAsMoment.toDate();
}

export function getLocale() {
    return navigator.language || navigator.userLanguage;
}

export function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

export function getDateAsString(date) {
    return date.toLocaleDateString(getLocale(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
