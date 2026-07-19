// api/drive.js — streams a filtered ZIP of a project's Google Drive files.
// Model: one central Ideal Music Google Drive, read via a service account.
// Dependency-free (uses Node's built-in crypto + a tiny STORE-method zip writer),
// so it deploys as a plain Vercel serverless function with no npm install.
//
// Required Vercel env vars (add in Project → Settings → Environment Variables):
//   GOOGLE_SA_KEY       = the FULL service-account JSON key, pasted as one value
//   SUPABASE_ANON_KEY   = sb_publishable_I7XfLRs48wPtgL8FV3MxDA_oL8QO9G9
//
// The Ideal Music Drive folder for each project must be SHARED (Viewer) with the
// service account's email (…@…iam.gserviceaccount.com). Then call:
//   /api/drive?folder=<driveFolderId>&kind=<project|masters|stems|mastersstems|all>
// with the user's Supabase access token in the Authorization: Bearer header.

const SUPA_URL = 'https://uazinektdhnqibwznnmu.supabase.co';

const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
  const crypto = require('crypto');
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(header + '.' + claim);
  const jwt = header + '.' + claim + '.' + b64url(signer.sign(sa.private_key));
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt,
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token: ' + JSON.stringify(j));
  return j.access_token;
}

async function listFolder(token, folderId) {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const r = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&pageSize=500&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives`,
    { headers: { Authorization: 'Bearer ' + token } });
  const j = await r.json();
  return j.files || [];
}
async function download(token, id) {
  const r = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: 'Bearer ' + token } });
  return Buffer.from(await r.arrayBuffer());
}

const KIND = {
  masters: (n) => /master/i.test(n),
  stems: (n) => /stem/i.test(n),
  project: (n) => /(project|session|brief|ref|file)/i.test(n),
  mastersstems: (n) => /master|stem/i.test(n),
  all: () => true,
};

// ---- minimal STORE (no compression) zip writer ----
const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC[(c ^ buf[i]) & 0xFF]; return (~c) >>> 0; }
function makeZip(files) {
  const parts = [], central = []; let offset = 0;
  const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n >>> 0); return b; };
  const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
  for (const f of files) {
    const name = Buffer.from(f.path, 'utf8'); const data = f.data; const crc = crc32(data);
    const local = Buffer.concat([u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name]);
    parts.push(local, data);
    central.push(Buffer.concat([u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
    offset += local.length + data.length;
  }
  const cd = Buffer.concat(central);
  const end = Buffer.concat([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(cd.length), u32(offset), u16(0)]);
  return Buffer.concat([...parts, cd, end]);
}

export default async function handler(req, res) {
  try {
    const auth = req.headers.authorization || '';
    const uu = await fetch(SUPA_URL + '/auth/v1/user', { headers: { Authorization: auth, apikey: process.env.SUPABASE_ANON_KEY || '' } });
    if (uu.status !== 200) return res.status(401).json({ error: 'Sign in required' });

    const folder = req.query.folder;
    const kind = (req.query.kind || 'all').toLowerCase();
    if (!folder) return res.status(400).json({ error: 'Missing folder id' });
    if (!process.env.GOOGLE_SA_KEY) return res.status(503).json({ error: 'Drive not configured yet' });

    const sa = JSON.parse(process.env.GOOGLE_SA_KEY);
    const token = await getAccessToken(sa);
    const match = KIND[kind] || KIND.all;

    const top = await listFolder(token, folder);
    const picked = [];
    for (const f of top) {
      if (f.mimeType === 'application/vnd.google-apps.folder') {
        if (kind === 'all' || match(f.name)) {
          const sub = await listFolder(token, f.id);
          for (const s of sub) if (s.mimeType !== 'application/vnd.google-apps.folder') picked.push({ path: f.name + '/' + s.name, id: s.id });
        }
      } else if (match(f.name)) {
        picked.push({ path: f.name, id: f.id });
      }
    }
    if (!picked.length) return res.status(404).json({ error: 'No matching files' });

    const withData = [];
    for (const p of picked) withData.push({ path: p.path, data: await download(token, p.id) });
    const zip = makeZip(withData);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="IdealMusic_${kind}.zip"`);
    return res.status(200).send(zip);
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
