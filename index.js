const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const port = process.env.PORT || 8001;
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listDonos);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

let housePointsDisplay = "";
let houses = {
  "Gryffindor": 0,
  "Hufflepuff":0,
  "Slytherin":0,
  "Ravenclaw":0
}
const houseNames = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'Ravenclaw']
let students = { 
  joefish5:0,
  oi_atomsk_io:2,
  danyrddaspanyrd:2,
  coop3r:3,
  thabuttress:2,
  witchychar:2,
  minovskyflight:1,
  theshyguy69:1,
  maverick825:3,
  grantypants:2,
  majintb:3,
  tonyvirgo:3,
  tripleb85:1,
  mythicalmonkey:2,
  donutscurecancer:1,
  garebear_:3,
  patrioticgrizzly:0,
  sauron2513:0,
  phorr:1,
  jarito180:2,
  trappmastuh:3,
  dinobrutalityx:3,
  ryokoie:2,
  makeetea: 0,
  yuudachi_san:0,
  streamline72:2,
  cjoflannel:0,
  zophkiel:2,
  sp4cem0nkey:2,
  zombocarnie:0,
  jeddkay:2,
  tawhite2720:2,
  verlin:3,
  cluelessgamer151:2,
  bigboss138:2,
  antonioreyx360:0,
  nebhusk32:3,
  darkfrytepanda:2,
  annakyns:3,
  jijeryfrits:1,
  pixelcruncher:0,
  popthatbabymaker:0,
  aofool:3,
  mistaken_miracles:2,
  thisroguelife:0,
  eneeliak:2,
  psn_centralpark:0,
  eladolo:0,
  ezegen:0,
  eddiethamd:2,
  blackdawn1980:2,
  periculum9:0,
  drdrinks420:3,
  hgeezy:1,
  acjc21:0,
  darkhatchet7000:2,
  whatupitsean:1,
  sammypno9:0,
  nodicemike:2,
  agentsnapcrackle:3,
  pupper8490:2,
  dragon1785:2,
  espioakakeith:2,
  duskguard:3,
  aleistercrowwley:3,
  viperstrikelol:3,
  taxikab86:0,
  chrisofbodom:0,
  silverstray:2,
  bobert_r:3,
  chrissmith147:0,
  alchahest:0,
  lolghostface:0,
  dtricks42:3,
  twask3v1n:1,
  thatzigygirl:3,
  mac_drachma:1,
  vfx10viper:3,
  cinerdella:2,
  krzykorean87:2,
  datfazbear:1,
  aardvarkpepper:3,
  edgeblade31:0,
  halfwingseen:2,
  monthis:2,
  unitymind:3,
  deven9484:3,
  thepaintmonkey:0,
  lostfoxman:1,
  krivas95:1,
  inquisitorburnzy:3,
  lumberjackdann:0,
  ekkonexus:1,
  nzstephenf:1,
  captaindaikyo:3,
  tsmax17:0,
  jimmytheguz:0,
  neumie92:2,
  mal5305:1,
  truedarkdogg:2,
  arkaynan:1,
  reiner72:0,
  itszenoox:3,
  carmillawoo:2,
  chadthachillest:0,
  henrynighthawk:1,
  admisan:2,
  reynte:3,
  deem518:0,
  heroic_piplup:2,
  firstman1978:0,
  bostontom:1,
  pandaloreart:3,
  wookie:1,
  actionba5tard:0,
  biggiesnacks:2,
  scarid:1,
  sleeping_quill:2,
  nimasho:3,
  realsarge198:0,
  gsoultaker:3,
  billdit:0,
  coldasiceii:1,
  du5tiin:3,
  dafallancaptain:3,
  drooyoo:0,
  blacklance:3,
  kjedi:3,
  blackjax:3,
  probit:3,
  castorr91:3,
  poidasmall:2,
  pickledeggz:1,
  samj30:3,
  ace0fjacks:2,
  j_skittah:1,
  roulette_king_yeti:3,
  fleetwood619:3,
  liingy:0,
  syl_x:1,
  ms85_hart: 3,
  micktrinus:2,
  garceaj:1,
  numbzeh:0,
  abbyfabby:0
  //gryf = 0, huff = 1, sly = 2, raven = 3
}
let highestSingle;
let highestName;
let highestAmount;
let highestHouse;
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1PtoEmET9AbnX2JwWDwygBKggdQuOZi69-STBMi4mKAw',
    range: 'Sheet1!A1:H',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    //let allScores = []
    if (rows.length) {
      // Print columns all, which correspond to indices 0 through 3.
      housePointsDisplay = `| ${rows[0][0]}: ${rows[1][0]} | ${rows[0][2]}: ${rows[1][2]} | ${rows[0][4]}: ${rows[1][4]} | ${rows[0][6]}: ${rows[1][6]} |`;
      console.log(housePointsDisplay)
      for(let i = 0; i < 7; i += 2)
        houses[rows[0][i]] = rows[1][i];
      
    } else {
      console.log('No data found.');
    }
  });
}

function getHouseName(name){
  //console.log(name)
  let num = students[name]
  //console.log(num)
  return `${houseNames[num]}`
}
function listDonos(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1PtoEmET9AbnX2JwWDwygBKggdQuOZi69-STBMi4mKAw',
    range: 'Donos!A1:B',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
   
    if (rows.length) {
      // Print columns all, which correspond to indices 0 through 1.
      highestSingle = rows[1];
      let length = rows.length
      for(let i = 2; i < length; ++i)
        if(Number(highestSingle[1].replace('$', '')) < Number(rows[i][1].replace('$', '')))
          highestSingle = rows[i]
      //console.log(highestSingle)
      highestName = highestSingle[0].trim().toLowerCase();
      highestAmount = highestSingle[1];
      highestHouse = getHouseName(highestName)

      return highestSingle;
    } else {
      console.log('No data found.');
    }
  });
}


// express calls
app.get('/points', (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), listMajors);
  });

  res.send(housePointsDisplay);
})

app.get('/houses', (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
  });

  res.status(200).json(houses);
})

app.get('/top', (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
      /* if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), listDonos) */
      console.log(highestName)
      console.log(highestAmount)
      console.log(highestHouse)

      
      res.send(`${highestHouse}: ${highestAmount}`);
  });
})

app.post('/', (req, res) => {
  try{
    students = req.body
    res.status(200).json('Students Updated')
  }
  catch(err){
    res.status(404).json(err)
  }
})

// rendering an html page
app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => console.log(`Listening on port ${port}`));