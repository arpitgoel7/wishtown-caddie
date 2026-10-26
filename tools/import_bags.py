"""Turn the bag form's responses into data/bags.json, which tools/build.py bakes into the app.
  python3 tools/import_bags.py <responses.xlsx | responses.csv | rows pasted from the sheet as .tsv>
Each player's latest response wins. Names are matched to data/roster.json (case and spaces ignored).
Notes:
- Google Sheets turns "220, 230" into the number 220230; such numbers are split back into carry/total.
- A side miss of 0 is treated as "not given" (the app then estimates it from the handicap).
- Confidence: ticked under "trust" = 4, under "avoid" = 2, both or neither = 3.
- "Any club that curves differently" is free text: per-club shapes from it are set by hand in OVERRIDES below."""
import csv, json, os, re, sys
ROOT = os.path.join(os.path.dirname(__file__), '..')
CLUBS = ['Driver', '3 Wood', '4 Wood', '5 Wood', '7 Wood', '9 Wood', '2 Hybrid', '3 Hybrid', '4 Hybrid', '5 Hybrid', '6 Hybrid',
         '3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW',
         '46°', '48°', '50°', '52°', '54°', '56°', '58°', '60°', '62°', '64°']
# per-club shape overrides read from the free-text answers (club -> 'D1'..'F3' or 'S')
OVERRIDES = {
    'Rahul Sharma': {'Driver': 'F2', '3 Hybrid': 'F2', '4 Iron': 'F1', '5 Iron': 'F1', 'PW': 'F1', '50°': 'F1', '54°': 'F1', '58°': 'F1'},
}

# players whose third number was a distance spread (+/- yds), not a left/right miss: side miss is left blank so the
# app estimates it from the handicap (owner, Oct 2026)
# bump to make phones re-load unedited form bags after an import-rule change
REV = ' r2'
IGNORE_SIDE = {'Deepak Yadav', 'Nitin Sahjwani'}

def rows_from(path):
    if path.lower().endswith(('.csv', '.tsv', '.txt')):  # .tsv/.txt = rows copied straight out of the sheet
        with open(path, newline='', encoding='utf-8') as f:
            rows = list(csv.DictReader(f, delimiter='\t' if not path.lower().endswith('.csv') else ','))
        return [{(k or '').strip(): v for k, v in r.items()} for r in rows]
    import openpyxl
    ws = openpyxl.load_workbook(path, data_only=True)['Form Responses 1']
    it = ws.iter_rows(values_only=True)
    hdr = [str(h).strip() if h is not None else '' for h in next(it)]
    return [dict(zip(hdr, r)) for r in it if any(v not in (None, '') for v in r)]

def club_numbers(v):
    """-> (carry, total, side) or None"""
    if v is None: return None
    if isinstance(v, (int, float)):
        d = str(int(v))
        if len(d) in (4, 5, 6):  # "220, 230" read as 220230 by Sheets
            for k in ((3,) if len(d) == 6 else (2, 3) if len(d) == 5 else (2,)):
                a, b = int(d[:k]), int(d[k:])
                if 20 <= a <= b <= 400: return a, b, 0
        return None
    s = str(v).strip().lower()
    if s in ('', 'no', 'na', 'n/a', '-', 'x'): return None
    n = [int(x) for x in re.findall(r'\d+', s)]
    if len(n) < 2: return None
    carry, total = n[0], max(n[0], n[1])
    return carry, total, (n[2] if len(n) > 2 else 0)

def ticked(v):
    return {c.strip() for c in str(v or '').split(',') if c.strip()}

def main():
    rows = rows_from(sys.argv[1])
    roster = json.load(open(f'{ROOT}/data/roster.json'))['players']
    key = lambda s: re.sub(r'\s+', ' ', str(s or '')).strip().lower()
    by_name = {key(p['name']): p['name'] for p in roster}
    out = {}
    for r in sorted(rows, key=lambda r: str(r.get('Timestamp') or '')):
        name = by_name.get(key(r.get('Your name')))
        if not name:
            print('skipped (not in roster):', r.get('Your name')); continue
        shape_txt = str(r.get('Your normal (stock) shape') or '').lower()
        shape = 'D' if shape_txt.startswith('draw') else 'F' if shape_txt.startswith('fade') else 'S'
        curve_txt = str(r.get('How much does it curve?') or '').lower()
        curve = 1 if curve_txt.startswith('small') else 3 if curve_txt.startswith('big') else 2
        trust, avoid = ticked(r.get('Clubs you trust under pressure')), ticked(r.get('Clubs you would rather avoid'))
        clubs = []
        for c in CLUBS:
            nums = club_numbers(r.get(c))
            if not nums: continue
            carry, total, side = nums
            conf = 4 if c in trust and c not in avoid else 2 if c in avoid and c not in trust else 3
            if name in IGNORE_SIDE: side = 0
            clubs.append({'name': c, 'carry': carry, 'total': total, 'acc': side or '', 'conf': conf,
                          'shape': OVERRIDES.get(name, {}).get(c, ''), 'on': True})
        # the roster's playing handicap is authoritative (owner); the form's value is only reported
        try: form_hcp = int(round(float(r.get('Playing handicap'))))
        except (TypeError, ValueError): form_hcp = None
        hcp = next(p['playingHandicap'] for p in roster if p['name'] == name)
        if form_hcp is not None and form_hcp != hcp: print(f'  {name}: form says handicap {form_hcp}, using roster {hcp}')
        notes = '; '.join(str(r.get(k)).strip() for k in ('Any club that curves differently? (optional)', 'Any other club? (optional)',
                          'Anything else about your game? (optional)') if r.get(k) and str(r.get(k)).strip().lower() not in ('no', 'na'))
        out[name] = {'hcp': hcp, 'tee': r.get('Tees you play') or None, 'shape': shape, 'curve': curve, 'clubs': clubs,
                     'updated': str(r.get('Timestamp')) + REV, 'notes': notes}
        print(f"{name:20s} hcp {hcp} {r.get('Tees you play')} shape {shape}{curve if shape != 'S' else ''} clubs {len(clubs)}"
              + (f'  notes: {notes}' if notes else ''))
    json.dump({'players': out}, open(f'{ROOT}/data/bags.json', 'w'), indent=1, ensure_ascii=False)
    print('wrote data/bags.json:', len(out), 'players')

if __name__ == '__main__':
    main()
