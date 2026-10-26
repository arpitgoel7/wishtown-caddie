/**
 * Wish Town Caddie — team bag form.
 * Run once from your own Google account:
 *   1. Go to https://script.google.com → New project, paste this whole file, Save.
 *   2. Pick `createTeamForm` in the toolbar and click Run. Allow the permissions it asks for.
 *   3. Open the "Links" tab of the spreadsheet it creates (the URL is printed in the Execution log).
 * Each player gets a personal link with their name, playing handicap and tee already filled in,
 * and a ready-to-send WhatsApp message. Responses land in the same spreadsheet.
 */

const TEAM = [ // from data/roster.json (playing handicaps)
  ['Anoop Singh', 16, 'Red'], ['Brig Pawan Bajaj', 14, 'Blue'], ['Aadesh Chopra', 18, 'Blue'],
  ['Arpit Goel', 18, 'Blue'], ['Vikas Suda', 18, 'Blue'], ['Gunjan Bijlani', 11, 'Red'],
  ['Nyra Singh', 2, 'Red'], ['Rahul Sharma', 10, 'Blue'], ['Nitin Sahjwani', 9, 'Blue'],
  ['Murli Mohan Malla', 9, 'Blue'], ['Naresh Rawat', 8, 'Blue'], ['Deepak Yadav', 7, 'Blue'],
];
const CLUBS = ['Driver', '3 Wood', '5 Wood', '7 Wood', '3 Hybrid', '4 Hybrid', '5 Hybrid', '4 Iron', '5 Iron',
  '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW', 'GW', 'SW', 'LW'];
const APP_URL = 'https://claude.ai/artifact/Qf7H6fiTVYjkjvjcrEqpMP';

function createTeamForm() {
  const form = FormApp.create('AAA Titans — Wish Town Caddie: your bag');
  form.setDescription('Two minutes, once. Your numbers go into the Wish Town Caddie app so its hole-by-hole plan ' +
    'is built on your own game, not sample numbers. Use normal shots on the course, not your best ones. ' +
    'You can edit your answers later from the confirmation email or the same link.');
  form.setConfirmationMessage('Thanks! Your plan in the app will use these numbers once Arpit loads them.');
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // --- About you (pre-filled per player) ---
  const name = form.addTextItem().setTitle('Your name').setRequired(true);
  const hcp = form.addTextItem().setTitle('Playing handicap').setRequired(true)
    .setValidation(FormApp.createTextValidation().setHelpText('A whole number, e.g. 18')
      .requireTextMatchesPattern('^\\s*\\d{1,2}\\s*$').build());
  const tee = form.addMultipleChoiceItem().setTitle('Tees you play').setRequired(true)
    .setChoiceValues(['Blue', 'Red', 'White', 'Black']);

  // --- Shot shape ---
  form.addPageBreakItem().setTitle('Your shot shape')
    .setHelpText('Right-handed shape. A draw curves left, a fade curves right.');
  form.addMultipleChoiceItem().setTitle('Your normal (stock) shape').setRequired(true)
    .setChoiceValues(['Draw (curves left)', 'Straight', 'Fade (curves right)']);
  form.addMultipleChoiceItem().setTitle('How much does it curve?')
    .setHelpText('Skip if you hit it straight.')
    .setChoiceValues(['Small (a few yards)', 'Medium', 'Big']);
  form.addParagraphTextItem().setTitle('Any club that curves differently? (optional)')
    .setHelpText('e.g. "Driver fades, irons draw"');

  // --- Distances ---
  form.addPageBreakItem().setTitle('Your distances (yards)')
    .setHelpText('For each club you carry type:  carry, total, side miss\n' +
      'carry = where it lands, total = where it stops, side miss = how far left or right a normal shot ' +
      'finishes from where you aimed. Example:  215, 235, 20\n' +
      'Side miss is optional (215, 235 is fine). Leave clubs you don\'t carry blank.');
  const pattern = '^\\s*\\d{2,3}\\s*[,/ ]\\s*\\d{2,3}(\\s*[,/ ]\\s*\\d{1,2})?\\s*$';
  for (const c of CLUBS) {
    form.addTextItem().setTitle(c).setValidation(FormApp.createTextValidation()
      .setHelpText('carry, total, side miss — e.g. 150, 156, 12').requireTextMatchesPattern(pattern).build());
  }

  // --- Confidence ---
  form.addPageBreakItem().setTitle('Confidence');
  form.addCheckboxItem().setTitle('Clubs you trust under pressure').setChoiceValues(CLUBS);
  form.addCheckboxItem().setTitle('Clubs you would rather avoid').setChoiceValues(CLUBS);
  form.addParagraphTextItem().setTitle('Anything else about your game? (optional)');

  // --- Responses sheet + personal links ---
  const ss = SpreadsheetApp.create('AAA Titans — Wish Town Caddie bags');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  const sh = ss.insertSheet('Links');
  sh.appendRow(['Player', 'Handicap', 'Tee', 'Personal form link', 'WhatsApp message']);
  for (const [n, h, t] of TEAM) {
    const r = form.createResponse()
      .withItemResponse(name.createResponse(n))
      .withItemResponse(hcp.createResponse(String(h)))
      .withItemResponse(tee.createResponse(t));
    let url = r.toPrefilledUrl();
    try { url = form.shortenFormUrl(url); } catch (e) { /* keep the long link */ }
    const first = n.replace(/^Brig\s+/, '').split(' ')[0];
    const msg = `Hi ${first}, this is your personal link for the Wish Town Caddie golf app (takes 2 min, ` +
      `name and handicap already filled in): ${url}\nThe app: ${APP_URL}`;
    sh.appendRow([n, h, t, url, msg]);
  }
  sh.setColumnWidth(4, 320); sh.setColumnWidth(5, 520);
  sh.getRange('E:E').setWrap(true);
  ss.setActiveSheet(sh);

  Logger.log('Form (edit): ' + form.getEditUrl());
  Logger.log('Form (general link): ' + form.getPublishedUrl());
  Logger.log('Spreadsheet with personal links: ' + ss.getUrl());
}
