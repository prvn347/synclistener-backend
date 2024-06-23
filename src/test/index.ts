import * as fs from "fs";
import * as readline from "readline";
import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as dotenv from "dotenv";
import { GaxiosResponse } from "gaxios";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
const TOKEN_PATH = "token.json";

async function main() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Check if we have previously stored a token.
  try {
    const token = await readToken();
    if (token) {
      oAuth2Client.setCredentials(token);
    } else {
      const newToken = await getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(newToken);
      await storeToken(newToken);
    }
  } catch (error) {
    console.error("Error retrieving access token", error);
    return;
  }

  const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

  const response: GaxiosResponse<youtube_v3.Schema$ChannelListResponse> =
    await youtube.channels.list({
      part: ["snippet", "contentDetails", "statistics"],
      mine: true,
    });

  console.log(response.data);
}

function readToken(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        // If the token file does not exist, resolve with an empty object
        if (err.code === "ENOENT") {
          resolve(null);
        } else {
          reject(err);
        }
      } else {
        resolve(JSON.parse(token.toString()));
      }
    });
  });
}

function storeToken(token: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) reject(err);
      console.log("Token stored to", TOKEN_PATH);
      resolve();
    });
  });
}

function getAccessToken(oAuth2Client: OAuth2Client): Promise<any> {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  });
}

main().catch(console.error);
