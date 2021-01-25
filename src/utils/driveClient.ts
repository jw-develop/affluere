import fetch from 'node-fetch';
import { HoldingRow } from '../component/HoldingsTable';

const scriptAddress = 'https://script.google.com/macros/s/AKfycbxcvZ1EHvgmm5Hqlm496clU9FmyaYHHd4zLBWrr9WdL3E4C-UQfjf2FXw/exec';

async function query(method: string) {
    return (await fetch(scriptAddress, {
        method: "POST",
        body: JSON.stringify({
            auth: process.env.REACT_APP_API_KEY!,
            method
        })
    })).json();
}

enum Format {
    NORMAL,
    DOLLAR,
    PERCENT
}
function formatNumber(x: string, format = Format.NORMAL) {
    if (!x) return "";
    switch (format) {
        case (Format.NORMAL): return parseFloat(x).toFixed(0);
        case (Format.DOLLAR): return "$ " + parseFloat(x).toFixed(2);
        case (Format.PERCENT): return `${(parseFloat(x) * 100).toFixed(2)}%`;
    }
}

class DriveClient {
    sheets: {[key: string]: HoldingRow[]} = {};
    initialized = false;

    getRows(sheetNames: string[]) {
        return sheetNames.reduce((acc, curr) => acc.concat(this.sheets[curr]), [] as HoldingRow[]);
    }
    getSheetNames() {return Object.keys(this.sheets)}

    updating = false;
    async update() {
        if (this.updating) return;
        this.updating = true;
        const response = await query("getSheets");
        this.sheets = {};
        for (const [sheetName, data] of Object.entries(response)) {
            let rows = [];
            for (const words of (data as string[][])) {
                rows.push({
                    symbol: words[0],
                    holding: words[1],
                    shares: formatNumber(words[2]),
                    price: formatNumber(words[4], Format.DOLLAR),
                    value_current: formatNumber(words[5], Format.DOLLAR),
                    total_change: formatNumber(words[6], Format.DOLLAR),
                    total_perc: formatNumber(words[7], Format.PERCENT),
                    day_change: formatNumber(words[9], Format.DOLLAR),
                    day_change_perc: formatNumber(words[10], Format.PERCENT),
                });
            }
            this.sheets[sheetName] = rows;
        }
        this.updating = false;
    }
}

const driveClient = new DriveClient();
export default driveClient;