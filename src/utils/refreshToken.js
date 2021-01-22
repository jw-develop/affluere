const readline = require('readline');
const {google} = require('googleapis');
const dotenv = require("dotenv");

dotenv.config();
refreshAccessToken();

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
function refreshAccessToken() {
    const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.CREDENTIALS).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        //   Store the token to disk for later program executions
        //   fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        //     if (err) return console.error(err);
        //     console.log('Token stored to', TOKEN_PATH);
        //   });
        });
    });
}
