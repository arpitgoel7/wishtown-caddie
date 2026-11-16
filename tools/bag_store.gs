/**
 * Wish Town Caddie — team bag store (Google Apps Script web app).
 * The app's "Set up my bag" screen sends each player's bag here; the app reads all bags back when it opens.
 *
 * One-time set-up, from your own Google account:
 *   1. https://script.google.com → New project. Delete what is there, paste this whole file, Save.
 *   2. Pick `setup` in the toolbar and click Run. Allow the permissions. It creates the spreadsheet
 *      "Wish Town Caddie — team bags" in your Drive and prints its link in the Execution log.
 *   3. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone. Deploy.
 *   4. Copy the Web app URL (ends in /exec) and send it to Claude; it goes into data/team.json.
 * To remove a player's bag, delete their row in the spreadsheet. If you edit this script later,
 * use Deploy → Manage deployments → Edit → Version: New version, so the URL stays the same.
 */

const SHEET_NAME = 'Bags';
const HEADER = ['Updated', 'Name', 'Handicap', 'Tee', 'Shape', 'Clubs (carry/total)', 'Bag (data for the app — do not edit)'];
const TEES = ['Black', 'Blue', 'White', 'Red'];

function setup() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  if (!id) {
    const ss = SpreadsheetApp.create('Wish Town Caddie — team bags');
    const sh = ss.getSheets()[0];
    sh.setName(SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
    sh.setColumnWidth(6, 420);
    id = ss.getId();
    props.setProperty('SHEET_ID', id);
  }
  Logger.log('Spreadsheet: ' + SpreadsheetApp.openById(id).getUrl());
}

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Run setup() first');
  return SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// GET: every saved bag, keyed by player name
function doGet() {
  try {
    const rows = sheet_().getDataRange().getValues().slice(1);
    const players = {};
    for (const r of rows) {
      try { const b = JSON.parse(r[6]); if (b && b.name) players[b.name] = b; } catch (e) { /* skip a damaged row */ }
    }
    return json_({ ok: true, players: players });
  } catch (e) {
    return json_({ ok: false, error: String(e.message || e) });
  }
}

// POST (text/plain JSON): save one bag; a later save for the same name replaces the earlier row
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const bag = clean_(JSON.parse(e.postData.contents));
    lock.waitLock(10000);
    const sh = sheet_();
    const key = bag.name.toLowerCase();
    const names = sh.getRange(1, 2, Math.max(1, sh.getLastRow()), 1).getValues().map((r) => String(r[0]).toLowerCase().replace(/^'/, ''));
    const row = [bag.updated, "'" + bag.name, bag.hcp, bag.tee, bag.shape === 'S' ? 'Straight' : (bag.shape === 'D' ? 'Draw ' : 'Fade ') + ['', 'small', 'medium', 'big'][bag.curve],
      bag.clubs.map((c) => c.name + ' ' + c.carry + '/' + c.total).join(', '), JSON.stringify(bag)];
    const at = names.indexOf(key);
    if (at > 0) sh.getRange(at + 1, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return json_({ ok: true, updated: bag.updated });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (e) { /* not held */ }
  }
}

// Accept only the fields the app sends, within sensible golf ranges
function clean_(b) {
  const int = (v, lo, hi) => { const n = Math.round(Number(v)); if (!(n >= lo && n <= hi)) throw new Error('value out of range'); return n; };
  const name = String(b.name || '').replace(/\s+/g, ' ').trim();
  if (!/^[\p{L}][\p{L} .'-]{1,39}$/u.test(name)) throw new Error('name: letters, spaces, . \' - only (2–40)');
  const tee = TEES.indexOf(b.tee) >= 0 ? b.tee : 'Blue';
  const shape = ['D', 'S', 'F'].indexOf(b.shape) >= 0 ? b.shape : 'S';
  const clubs = (Array.isArray(b.clubs) ? b.clubs : []).slice(0, 20).map((c) => {
    const carry = int(c.carry, 20, 350);
    return {
      name: String(c.name || '').replace(/[^\p{L}\p{N} °.-]/gu, '').slice(0, 14) || 'Club',
      carry: carry, total: int(c.total == null ? carry : c.total, carry, carry + 60),
      acc: c.acc === '' || c.acc == null ? '' : int(c.acc, 1, 80),
      conf: c.conf == null ? 3 : int(c.conf, 1, 5),
      shape: /^(S|[DF][123])?$/.test(String(c.shape || '')) ? String(c.shape || '') : '',
      on: true,
    };
  });
  if (!clubs.length) throw new Error('no clubs');
  return {
    name: name, hcp: int(b.hcp, 0, 54), tee: tee, gender: b.gender === 'F' ? 'F' : 'M',
    shape: shape, curve: shape === 'S' ? 2 : int(b.curve, 1, 3), accMode: 'yds', clubs: clubs,
    updated: new Date().toISOString(),
  };
}
