// api/drive-sync.js — keeps Google Drive in sync with the dashboard (the source of truth).
// Central Ideal Music Drive, service-account writes. Standardized structure:
//   <ROOT>/<Client>/<Project>/
//        Masters
//        Stems            (only when the project has stems)
//        Contracts/
//            Signed Contract
//            Invoice
//
// Dependency-free (Node built-in crypto + fetch). Deploys as a plain Vercel function.
//
// Env vars (Vercel → Settings → Environment Variables):
//   GOOGLE_SA_KEY      = full service-account JSON key (one value)
//   SUPABASE_ANON_KEY  = sb_publishable_I7XfLRs48wPtgL8FV3MxDA_oL8QO9G9
//   DRIVE_ROOT_FOLDER  = id of the shared "Ideal Music" root folder (share it as EDITOR with the SA email)
//
// POST JSON { action, ... } with the caller's Supabase access token in Authorization: Bearer.
//   ensure      { client, project, hasStems }   -> find-or-create the whole tree, returns all folder ids
//   rename      { folderId, name }               -> rename a folder (e.g. when a project is renamed)
//   renameFile  { fileId, name }                 -> rename a file
//   uploadInit  { folderId, name, mimeType }     -> returns { uploadUrl } for a resumable upload
//                                                   (the browser then PUTs the file bytes straight to Google)

const SUPA_URL = 'https://uazinektdhnqibwznnmu.supabase.co';
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/drive',
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

async function drive(token, path, opts = {}) {
  const r = await fetch('https://www.googleapis.com/drive/v3/' + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + token, ...(opts.headers || {}) },
  });
  const txt = await r.text();
  let j; try { j = JSON.parse(txt); } catch { j = {}; }
  if (!r.ok) throw new Error('drive ' + r.status + ': ' + txt);
  return j;
}

async function findChild(token, parent, name, folderOnly) {
  const esc = String(name).replace(/'/g, "\\'");
  let q = `name = '${esc}' and '${parent}' in parents and trashed = false`;
  if (folderOnly) q += " and mimeType = 'application/vnd.google-apps.folder'";
  const j = await drive(token, 'files?q=' + encodeURIComponent(q) + '&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives');
  return (j.files && j.files[0]) || null;
}
async function ensureFolder(token, parent, name) {
  const found = await findChild(token, parent, name, true);
  if (found) return found.id;
  const j = await drive(token, 'files?fields=id&supportsAllDrives=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parent] }),
  });
  return j.id;
}
async function renameItem(token, id, name) {
  return drive(token, 'files/' + id + '?fields=id,name&supportsAllDrives=true', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    // caller must be a signed-in Supabase user
    const auth = req.headers.authorization || '';
    const uu = await fetch(SUPA_URL + '/auth/v1/user', { headers: { Authorization: auth, apikey: process.env.SUPABASE_ANON_KEY || '' } });
    if (uu.status !== 200) return res.status(401).json({ error: 'Sign in required' });

    if (!process.env.GOOGLE_SA_KEY) return res.status(503).json({ error: 'Drive not configured yet' });
    const sa = JSON.parse(process.env.GOOGLE_SA_KEY);
    const ROOT = process.env.DRIVE_ROOT_FOLDER;
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const token = await getToken(sa);

    if (body.action === 'ensure') {
      if (!ROOT) return res.status(503).json({ error: 'DRIVE_ROOT_FOLDER not set' });
      const client = await ensureFolder(token, ROOT, body.client || 'Unassigned');
      const project = await ensureFolder(token, client, body.project || 'Untitled Project');
      const masters = await ensureFolder(token, project, 'Masters');
      const stems = body.hasStems ? await ensureFolder(token, project, 'Stems') : null;
      const contracts = await ensureFolder(token, project, 'Contracts');
      const signed = await ensureFolder(token, contracts, 'Signed Contract');
      const invoice = await ensureFolder(token, contracts, 'Invoice');
      return res.status(200).json({ ok: true, folders: { client, project, masters, stems, contracts, signed, invoice } });
    }
    if (body.action === 'rename') {
      if (!body.folderId || !body.name) return res.status(400).json({ error: 'folderId + name required' });
      const j = await renameItem(token, body.folderId, body.name);
      return res.status(200).json({ ok: true, id: j.id, name: j.name });
    }
    if (body.action === 'renameFile') {
      if (!body.fileId || !body.name) return res.status(400).json({ error: 'fileId + name required' });
      const j = await renameItem(token, body.fileId, body.name);
      return res.status(200).json({ ok: true, id: j.id, name: j.name });
    }
    if (body.action === 'uploadInit') {
      if (!body.folderId || !body.name) return res.status(400).json({ error: 'folderId + name required' });
      // reflect the caller's origin so Google enables CORS on the resumable session (browser PUT)
      const origin = (req.headers.origin) || 'https://dashboard.ideal-music.net';
      const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Origin: origin },
        body: JSON.stringify({ name: body.name, parents: [body.folderId] }),
      });
      const uploadUrl = r.headers.get('location');
      if (!uploadUrl) return res.status(500).json({ error: 'no upload url', detail: await r.text() });
      return res.status(200).json({ ok: true, uploadUrl, mimeType: body.mimeType || 'application/octet-stream' });
    }
    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
