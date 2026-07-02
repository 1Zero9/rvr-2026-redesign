import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_UPLOAD_BYTES, parseUpload } from '../lib/competitions/upload-parser';

test('competition upload parser handles quoted CSV values and flags duplicates', async () => {
  const csv = [
    '\uFEFFFirst Name,Last Name,Age Group,School,Available Days',
    'Aoife,O\'Brien,U12,"St. Finian\'s, Swords","Saturday; Sunday"',
    'Aoife,O\'Brien,U13,St. Finian\'s,Saturday',
  ].join('\n');

  const rows = await parseUpload(Buffer.from(csv), 'players.csv', 'U12');
  assert.equal(rows.length, 2);
  assert.equal(rows[0]?.displayName, 'Aoife O.');
  assert.equal(rows[0]?.clubOrSchool, "St. Finian's, Swords");
  assert.deepEqual(rows[0]?.availableDays, ['Saturday', 'Sunday']);
  assert.ok(rows[1]?.flags.some((flag) => flag.includes('Probable duplicate')));
  assert.ok(rows[1]?.flags.some((flag) => flag.includes('Age group mismatch')));
});

test('competition upload parser rejects unsupported and oversized files', async () => {
  await assert.rejects(
    parseUpload(Buffer.from('name\nAoife'), 'players.xls'),
    /Unsupported file type/,
  );
  await assert.rejects(
    parseUpload(Buffer.alloc(MAX_UPLOAD_BYTES + 1), 'players.csv'),
    /File is too large/,
  );
});
