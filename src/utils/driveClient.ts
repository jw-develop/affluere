import fetch from 'node-fetch';
import { HoldingRow } from '../containers/HoldingsTable';

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
                    shares: words[2],
                    price: words[4],
                    value_current: words[5],
                    total_change: words[6],
                    total_perc: words[7],
                    day_change: words[9],
                    day_change_perc: words[10],
                });
            }
            this.sheets[sheetName] = rows;
        }
        this.updating = false;
    }
}

const driveClient = new DriveClient();
export default driveClient;