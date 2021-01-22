import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive';

let signingIn = false;
class DriveClient {
  constructor() {
    const client_id = process.env.REACT_APP_CLIENT_ID;
    gapi.load('client:auth2', () => {
      gapi.client.init({
        client_id: client_id,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      if (!signingIn) {
        signingIn = true;
        gapi.auth2.getAuthInstance().signIn();
      }
    })
  }
  async list() {
    if (gapi.client) {
      const res = await gapi.client.drive.files.export({
        fileId: "process.env.FILE_ID",
        mimeType: "text/csv"
      });
      const { body } = res;
      const lines = (body) ? body.split('\n') : [];
      if (lines.length) {
        return lines.map(l => {
          const words = l.split(',');
          return {
            symbol: words[0],
            holding: words[1],
            shares: words[2],
            price: words[3],
            change: words[4],
            value: words[7]
          }
        });
      }
      else {
        console.log('No lines found.');
      }
    }
    return undefined;
  }
}

const driveClient = new DriveClient();
export default driveClient;