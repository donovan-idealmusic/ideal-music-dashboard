// api/audio.js — private, secure audio streaming proxy for Google Drive.
//
// The client never sees the Drive fileId, share link, folder structure, or any
// service-account token. The dashboard calls /api/review { action:'getPlayback' }
// (which authenticates the user + checks project access) and receives a SIGNED,
// short-lived URL that points here:
//     /api/audio?vid=<versionId>&exp=<unixSeconds>&sig=<hmac>
// This endpoint verifies the signature (no per-range auth round-trip needed, so a
// native <audio> element can request byte ranges directly), maps the internal
// version id -> Drive fileId server-side, and streams the bytes with HTTP Range
// support. Files stay PRIVATE in Drive (shared only with the service account).
//
// Env vars (Vercel): GOOGLE_SA_KEY, SUPABASE_SERVICE_ROLE_KEY,
//                    AUDIO_SIGNING_SECRET (optional; falls back to the service role key)

const SUPA_URL = 'https://uazinektdhnqibwznnmu.supabase.co';
const SROLE = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SECRET = () => process.env.AUDIO_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function verify(vid, exp, sig) {
  const crypto = require('crypto');
  if (!vid || !exp || !sig) return false;
  if (Number(exp) * 1000 < Date.now()) return false;            // expired
  const good = crypto.createHmac('sha256', SECRET()).update(vid + '.' + exp).digest('hex');
  const a = Buffer.from(good), b = Buffer.from(String(sig));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function db(path) {
  const r = await fetch(SUPA_URL + '/rest/v1/' + path, {
    headers: { apikey: SROLE(), Authorization: 'Bearer ' + SROLE() },
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('db ' + r.status + ': ' + txt);
  return txt ? JSON.parse(txt) : null;
}

async function getToken(sa) {
  const crypto = require('crypto');
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
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

export default async function handler(req, res) {
  try {
    const { vid, exp, sig } = req.query || {};
    if (!verify(vid, exp, sig)) return res.status(403).json({ error: 'invalid or expired link', code: 'signature' });
    if (!SROLE()) return res.status(503).json({ error: 'not configured', code: 'config' });
    if (!process.env.GOOGLE_SA_KEY) return res.status(503).json({ error: 'Drive not configured', code: 'config' });

    // map internal version id -> Drive fileId (server-side only)
    const rows = await db(`submission_versions?id=eq.${vid}&select=drive_file_id,mime_type,processing_status,original_filename`);
    const v = rows && rows[0];
    if (!v) return res.status(404).json({ error: 'not found', code: 'missing' });
    if (!v.drive_file_id) return res.status(409).json({ error: 'no audio yet', code: 'processing' });
    if (v.processing_status && v.processing_status !== 'ready') {
      return res.status(425).json({ error: 'still processing', code: v.processing_status });
    }

    const sa = JSON.parse(process.env.GOOGLE_SA_KEY);
    const token = await getToken(sa);

    // forward Range so the browser can stream/seek without downloading the whole file
    const range = req.headers.range;
    const driveHeaders = { Authorization: 'Bearer ' + token };
    if (range) driveHeaders.Range = range;

    const url = `https://www.googleapis.com/drive/v3/files/${v.drive_file_id}?alt=media&supportsAllDrives=true`;
    const dr = await fetch(url, { headers: driveHeaders });

    if (dr.status === 404) return res.status(404).json({ error: 'file missing', code: 'missing' });
    if (dr.status === 403) return res.status(403).json({ error: 'permission lost', code: 'permission' });
    if (dr.status !== 200 && dr.status !== 206) {
      return res.status(502).json({ error: 'drive error', code: 'drive_error', status: dr.status });
    }

    // pass through streaming headers; audio bytes are private → never shared-cache
    res.status(dr.status);
    res.setHeader('Content-Type', v.mime_type || dr.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'private, no-store');
    if (req.query.dl) {
      const fn = (v.original_filename || ('demo-' + vid.slice(0, 8) + '.' + ((v.mime_type || 'audio/mpeg').split('/')[1] || 'mp3'))).replace(/[\r\n"]/g, '');
      res.setHeader('Content-Disposition', 'attachment; filename="' + fn + '"');
    }
    const cl = dr.headers.get('content-length'); if (cl) res.setHeader('Content-Length', cl);
    const cr = dr.headers.get('content-range'); if (cr) res.setHeader('Content-Range', cr);

    if (!dr.body) { res.end(); return; }
    const { Readable } = require('stream');
    Readable.fromWeb(dr.body).pipe(res);
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: String((e && e.message) || e), code: 'server' });
    else { try { res.end(); } catch (_) {} }
  }
}
