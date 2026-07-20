// api/review.js — Review/feedback/demo-review workflow endpoints (anonymity-preserving).
// Server-authoritative: verifies the caller's Supabase identity + role, then performs
// privileged writes with the service role so RLS can stay strict and clients/artists
// never touch each other's identity.
//
// Env vars (Vercel → Settings → Environment Variables):
//   SUPABASE_ANON_KEY          = sb_publishable_... (already set)
//   SUPABASE_SERVICE_ROLE_KEY  = service_role key (Supabase → Settings → API)  <-- REQUIRED for this endpoint
//
// POST JSON { action, ... } with the caller's Supabase access token in Authorization: Bearer.
//   uploadVersion  { submission_id, drive_file_id?, file_format?, duration_sec?, revision_summary? }  (artist)
//   decide         { submission_id, decision, general_text?, items?[], comments?[] }                   (client)
//                    decision ∈ approve | reject | request_changes
//   sendMessage    { project_id, submission_id?, body }                                               (client|artist)
//   listThread     { submission_id }   -> anonymized versions + feedback for the caller's role
//
// Never returns identity fields (uploader/author/sender ids or names) to client/artist callers.

import { screenMessage, NEUTRAL_BLOCK_MSG } from './_validate.js';

const SUPA_URL = 'https://uazinektdhnqibwznnmu.supabase.co';
const ANON = () => process.env.SUPABASE_ANON_KEY || '';
const SROLE = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SECRET = () => process.env.AUDIO_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// short-lived signed URL for the private audio proxy (verified server-side by /api/audio)
function signAudio(vid, ttlSec = 1800) {
  const crypto = require('crypto');
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const sig = crypto.createHmac('sha256', SECRET()).update(vid + '.' + exp).digest('hex');
  return { url: `/api/audio?vid=${vid}&exp=${exp}&sig=${sig}`, exp };
}

// ── Google Drive helpers (service account; Drive is the source of truth for audio) ──
async function driveToken(scope) {
  const crypto = require('crypto');
  const sa = JSON.parse(process.env.GOOGLE_SA_KEY || '{}');
  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64url(JSON.stringify({ iss: sa.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const s = crypto.createSign('RSA-SHA256'); s.update(h + '.' + c);
  const jwt = h + '.' + c + '.' + b64url(s.sign(sa.private_key));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt });
  const j = await r.json(); if (!j.access_token) throw new Error('drive token: ' + JSON.stringify(j)); return j.access_token;
}
async function driveApi(token, path, opts = {}) {
  const r = await fetch('https://www.googleapis.com/drive/v3/' + path, { ...opts, headers: { Authorization: 'Bearer ' + token, ...(opts.headers || {}) } });
  const txt = await r.text(); let j; try { j = JSON.parse(txt); } catch { j = {}; }
  return { status: r.status, ok: r.ok, j, txt };
}
async function driveEnsureFolder(token, parent, name) {
  const esc = String(name).replace(/'/g, "\\'");
  const q = `name = '${esc}' and '${parent}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`;
  const f = await driveApi(token, 'files?q=' + encodeURIComponent(q) + '&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives');
  if (f.j.files && f.j.files[0]) return f.j.files[0].id;
  const c = await driveApi(token, 'files?fields=id&supportsAllDrives=true', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parent] }) });
  return c.j.id;
}

// --- REST helper against PostgREST using the service role (server-authoritative)
async function db(path, { method = 'GET', body, prefer } = {}) {
  const r = await fetch(SUPA_URL + '/rest/v1/' + path, {
    method,
    headers: {
      apikey: SROLE(),
      Authorization: 'Bearer ' + SROLE(),
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  let j; try { j = txt ? JSON.parse(txt) : null; } catch { j = txt; }
  if (!r.ok) throw new Error('db ' + r.status + ': ' + txt);
  return j;
}

async function whoami(auth) {
  const u = await fetch(SUPA_URL + '/auth/v1/user', { headers: { Authorization: auth, apikey: ANON() } });
  if (u.status !== 200) return null;
  const user = await u.json();
  // role lives in profiles
  const rows = await db(`profiles?id=eq.${user.id}&select=id,role`);
  const role = (rows && rows[0] && rows[0].role) || 'client';
  return { id: user.id, role };
}
const isStaff = (role) => role === 'admin' || role === 'superadmin';

async function audit(actor, action, entity_type, entity_id, meta) {
  try { await db('audit_log', { method: 'POST', body: [{ actor_id: actor.id, actor_role: actor.role, action, entity_type, entity_id, meta: meta || {} }] }); } catch {}
}

async function notify(userId, kind, title, body, ids) {
  if (!userId) return;
  try { await db('notifications', { method: 'POST', body: [{ user_id: userId, kind, title: title || null, body: body || null,
    project_id: (ids && ids.project_id) || null, submission_id: (ids && ids.submission_id) || null, version_id: (ids && ids.version_id) || null }] }); } catch {}
}

// coarse, identity-safe label for who uploaded/authored (role only, never a name/id)
function coarseRole(uid, project, meRole) {
  if (project && uid === project.artist_id) return 'artist';
  if (project && uid === project.client_id) return 'client';
  return 'team';
}

// map decision -> submission status
const DEC_STATUS = { approve: 'approved', reject: 'rejected', request_changes: 'changes_requested' };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    if (!SROLE()) return res.status(503).json({ error: 'Review backend not configured (missing SUPABASE_SERVICE_ROLE_KEY)' });

    const me = await whoami(req.headers.authorization || '');
    if (!me) return res.status(401).json({ error: 'Sign in required' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const action = body.action;

    // helper: load a submission + verify the caller may act on it, without leaking identity
    async function loadSub(id) {
      const rows = await db(`submissions?id=eq.${id}&select=id,project_id,artist_id,status,current_version,approved_version,max_revisions`);
      const s = rows && rows[0];
      if (!s) return null;
      const pr = await db(`projects?id=eq.${s.project_id}&select=id,client_id,artist_id,title,drive_folder_id`);
      s.project = pr && pr[0];
      return s;
    }
    function canSee(s) {
      return isStaff(me.role) || (s.project && (s.project.client_id === me.id || s.project.artist_id === me.id)) || s.artist_id === me.id;
    }

    // ---- ARTIST: upload a new immutable version
    if (action === 'uploadVersion') {
      const s = await loadSub(body.submission_id);
      if (!s) return res.status(404).json({ error: 'submission not found' });
      const isOwnerArtist = s.artist_id === me.id || (s.project && s.project.artist_id === me.id);
      if (!(isStaff(me.role) || isOwnerArtist)) return res.status(403).json({ error: 'not allowed' });
      // enforce revision limit
      const existing = await db(`submission_versions?submission_id=eq.${s.id}&select=version_no&order=version_no.desc&limit=1`);
      const nextNo = ((existing[0] && existing[0].version_no) || 0) + 1;
      // optional revision summary passes the protected-message filter
      if (body.revision_summary) {
        const chk = screenMessage(body.revision_summary);
        if (!chk.ok) return res.status(200).json({ blocked: true, message: NEUTRAL_BLOCK_MSG });
      }
      const procStatus = body.drive_file_id ? (body.processing_status || 'ready') : 'processing';
      const ins = await db('submission_versions', {
        method: 'POST', prefer: 'return=representation',
        body: [{ submission_id: s.id, version_no: nextNo, uploader_id: me.id,
                 drive_file_id: body.drive_file_id || null, file_format: body.file_format || null,
                 duration_sec: body.duration_sec || null, revision_summary: body.revision_summary || null,
                 drive_folder_id: body.drive_folder_id || null, mime_type: body.mime_type || null,
                 size_bytes: body.size_bytes || null, original_filename: body.original_filename || null,
                 processing_status: procStatus, last_synced_at: body.drive_file_id ? new Date().toISOString() : null,
                 sync_history: [{ at: new Date().toISOString(), event: 'uploaded', status: procStatus }] }],
      });
      // (submission.status + current_version + status_history + audit are set by the DB trigger)
      const v = ins[0];
      await audit(me, 'version.upload', 'submission', s.id, { version_id: v.id, version_no: v.version_no });
      // notify the client that a new version awaits review (identity-safe)
      if (s.project && s.project.client_id) {
        await notify(s.project.client_id, 'new_version', 'New version to review',
          'Version ' + v.version_no + ' is ready for your review.',
          { project_id: s.project_id, submission_id: s.id, version_id: v.id });
      }
      return res.status(200).json({ ok: true, version: { id: v.id, version_no: v.version_no, processing_status: procStatus } });
    }

    // ---- CLIENT: decision + feedback (server-authoritative; identity never exposed)
    if (action === 'decide') {
      const s = await loadSub(body.submission_id);
      if (!s) return res.status(404).json({ error: 'submission not found' });
      const isClient = s.project && s.project.client_id === me.id;
      if (!(isStaff(me.role) || isClient)) return res.status(403).json({ error: 'not allowed' });
      const newStatus = DEC_STATUS[body.decision];
      if (!newStatus) return res.status(400).json({ error: 'bad decision' });
      const vId = s.current_version;

      // feedback (general) + structured items + timestamped comments, tied to the current version
      let feedbackId = null;
      if (body.general_text || (body.items && body.items.length) || (body.comments && body.comments.length)) {
        if (body.general_text) {
          const chk = screenMessage(body.general_text);
          if (!chk.ok) return res.status(200).json({ blocked: true, message: NEUTRAL_BLOCK_MSG });
        }
        const fb = await db('feedback', { method: 'POST', prefer: 'return=representation',
          body: [{ version_id: vId, author_id: me.id, author_role: isStaff(me.role) ? 'admin' : 'client',
                   general_text: body.general_text || null, priority: body.priority || null }] });
        feedbackId = fb[0] && fb[0].id;
        if (body.items && body.items.length) {
          await db('revision_items', { method: 'POST', body: body.items.map((it) => ({
            version_id: vId, category: it.category || null, body: it.body || null, level: it.level || 'recommended' })) });
        }
        if (body.comments && body.comments.length) {
          for (const c of body.comments) { const chk = screenMessage(c.body || ''); if (!chk.ok) return res.status(200).json({ blocked: true, message: NEUTRAL_BLOCK_MSG }); }
          await db('timestamped_comments', { method: 'POST', body: body.comments.map((c) => ({
            version_id: vId, author_id: me.id, ts_sec: c.ts_sec, body: c.body || null })) });
        }
      }

      // transactional-ish status update + history + lock on approve
      const patch = { status: newStatus, updated_at: new Date().toISOString() };
      if (body.decision === 'approve') patch.approved_version = vId;
      await db(`submissions?id=eq.${s.id}`, { method: 'PATCH', body: patch });
      if (vId) {
        await db(`submission_versions?id=eq.${vId}`, { method: 'PATCH', body: { decision: newStatus, is_locked: body.decision === 'approve' } });
      }
      await db('status_history', { method: 'POST', body: [{ submission_id: s.id, version_id: vId, actor_id: me.id,
        actor_role: isStaff(me.role) ? 'admin' : 'client', prev_status: s.status, new_status: newStatus, feedback_id: feedbackId }] });
      await audit(me, 'decision.' + body.decision, 'submission', s.id, { version_id: vId });
      // notify the artist of the client's decision (identity-safe)
      const artistId = (s.project && s.project.artist_id) || s.artist_id;
      const kindMap = { approve: 'decision_approved', reject: 'decision_rejected', request_changes: 'decision_changes' };
      const titleMap = { approve: 'Version approved', reject: 'Version rejected', request_changes: 'Changes requested' };
      await notify(artistId, kindMap[body.decision], titleMap[body.decision],
        body.decision === 'approve' ? 'The client approved this version.' : 'The client left feedback on this version.',
        { project_id: s.project_id, submission_id: s.id, version_id: vId });
      return res.status(200).json({ ok: true, status: newStatus });
    }

    // ---- Protected message (client|artist). Validated in UI too; server is authoritative.
    if (action === 'sendMessage') {
      if (!body.project_id || !body.body) return res.status(400).json({ error: 'project_id + body required' });
      // authorization: caller must be a participant of the project
      const pr = await db(`projects?id=eq.${body.project_id}&select=id,client_id,artist_id`);
      const p = pr && pr[0];
      const participant = isStaff(me.role) || (p && (p.client_id === me.id || p.artist_id === me.id));
      if (!participant) return res.status(403).json({ error: 'not allowed' });
      const chk = screenMessage(body.body);
      if (!chk.ok) {
        // store the blocked attempt for moderation, but do NOT deliver
        await db('messages', { method: 'POST', body: [{ project_id: body.project_id, submission_id: body.submission_id || null,
          sender_id: me.id, sender_role: me.role, body: body.body, status: 'blocked', flagged_reason: chk.reason }] });
        await audit(me, 'message.block', 'message', null, { reason: chk.reason });
        return res.status(200).json({ blocked: true, message: NEUTRAL_BLOCK_MSG });
      }
      const ins = await db('messages', { method: 'POST', prefer: 'return=representation',
        body: [{ project_id: body.project_id, submission_id: body.submission_id || null,
                 sender_id: me.id, sender_role: me.role, body: body.body, status: 'delivered' }] });
      await audit(me, 'message.send', 'message', ins[0] && ins[0].id, {});
      return res.status(200).json({ ok: true, id: ins[0] && ins[0].id });
    }

    // ---- Anonymized thread for the caller (versions + safe feedback; no identities)
    if (action === 'listThread') {
      const s = await loadSub(body.submission_id);
      if (!s || !canSee(s)) return res.status(403).json({ error: 'not allowed' });
      const raw = await db(`submission_versions?submission_id=eq.${s.id}&select=id,version_no,uploader_id,drive_file_id,file_format,mime_type,size_bytes,original_filename,duration_sec,revision_summary,decision,deadline_next,is_locked,processing_status,last_synced_at,created_at&order=version_no.asc`);
      const vIds = raw.map((v) => v.id);
      let feedback = [], items = [], comments = [];
      if (vIds.length) {
        const inList = '(' + vIds.join(',') + ')';
        feedback = await db(`feedback?version_id=in.${inList}&select=id,version_id,general_text,priority,created_at&order=created_at.asc`);
        items    = await db(`revision_items?version_id=in.${inList}&select=id,version_id,category,body,level,completed`);
        comments = await db(`timestamped_comments?version_id=in.${inList}&select=id,version_id,ts_sec,body,created_at&order=ts_sec.asc`);
      }
      const lastFbBy = {};
      for (const f of feedback) lastFbBy[f.version_id] = f.created_at;
      // sanitize versions: never leak the Drive fileId; expose only role-level authorship + safe metadata
      const versions = raw.map((v) => ({
        id: v.id, version_no: v.version_no, by: coarseRole(v.uploader_id, s.project),
        file_format: v.file_format, mime_type: v.mime_type, size_bytes: v.size_bytes,
        original_filename: v.original_filename, duration_sec: v.duration_sec,
        revision_summary: v.revision_summary, decision: v.decision, deadline_next: v.deadline_next,
        is_locked: v.is_locked, processing_status: v.processing_status || (v.drive_file_id ? 'ready' : 'processing'),
        has_audio: !!v.drive_file_id, last_synced_at: v.last_synced_at,
        last_feedback_at: lastFbBy[v.id] || null, created_at: v.created_at,
      }));
      // messages: only delivered ones, stripped of sender identity (role only)
      const msgs = await db(`messages?project_id=eq.${s.project_id}&status=eq.delivered&select=id,sender_role,body,created_at&order=created_at.asc`);
      return res.status(200).json({ ok: true,
        submission: { id: s.id, status: s.status, current_version: s.current_version, approved_version: s.approved_version, max_revisions: s.max_revisions },
        versions, feedback, items, comments, messages: msgs });
    }

    // ---- Signed, short-lived playback URL for the private audio proxy (no fileId leaked)
    if (action === 'getPlayback') {
      const vr = await db(`submission_versions?id=eq.${body.version_id}&select=id,submission_id,drive_file_id,mime_type,duration_sec,size_bytes,processing_status`);
      const ver = vr && vr[0];
      if (!ver) return res.status(404).json({ error: 'version not found' });
      const s = await loadSub(ver.submission_id);
      if (!s || !canSee(s)) return res.status(403).json({ error: 'not allowed' });
      const st = ver.processing_status || (ver.drive_file_id ? 'ready' : 'processing');
      if (!ver.drive_file_id || st !== 'ready') {
        return res.status(200).json({ ok: true, ready: false, status: st, mime: ver.mime_type || null, duration_sec: ver.duration_sec || null });
      }
      const sg = signAudio(ver.id);
      return res.status(200).json({ ok: true, ready: true, status: 'ready', url: sg.url, exp: sg.exp,
        mime: ver.mime_type || 'audio/mpeg', duration_sec: ver.duration_sec || null, size_bytes: ver.size_bytes || null });
    }

    // ---- Submissions the caller can review (anonymized summary)
    if (action === 'listMine') {
      let projs;
      if (isStaff(me.role)) projs = await db(`projects?select=id,title,client_id,artist_id&order=created_at.desc&limit=200`);
      else projs = await db(`projects?or=(client_id.eq.${me.id},artist_id.eq.${me.id})&select=id,title,client_id,artist_id&limit=200`);
      const pById = {}; (projs || []).forEach((p) => { pById[p.id] = p; });
      const pIds = (projs || []).map((p) => p.id);
      if (!pIds.length) return res.status(200).json({ ok: true, items: [] });
      const subs = await db(`submissions?project_id=in.(${pIds.join(',')})&select=id,project_id,status,current_version,approved_version,updated_at&order=updated_at.desc&limit=300`);
      const sIds = (subs || []).map((x) => x.id);
      let vers = [];
      if (sIds.length) vers = await db(`submission_versions?submission_id=in.(${sIds.join(',')})&select=id,submission_id,version_no,processing_status,created_at`);
      const items = (subs || []).map((sub) => {
        const vs = vers.filter((v) => v.submission_id === sub.id);
        const cur = vs.find((v) => v.id === sub.current_version);
        const appr = vs.find((v) => v.id === sub.approved_version);
        const proj = pById[sub.project_id] || {};
        return { submission_id: sub.id, project_id: sub.project_id, project_title: proj.title || 'Project',
          role: coarseRole(me.id, proj), status: sub.status, versions_count: vs.length,
          current_version_no: cur ? cur.version_no : (vs.length ? Math.max.apply(null, vs.map((v) => v.version_no)) : 0),
          approved_version_no: appr ? appr.version_no : null, updated_at: sub.updated_at };
      });
      return res.status(200).json({ ok: true, items });
    }

    // ---- Verify a version against Drive (existence / rename / permissions / processing)
    if (action === 'syncVersion') {
      const vr = await db(`submission_versions?id=eq.${body.version_id}&select=id,submission_id,drive_file_id,processing_status,sync_history`);
      const ver = vr && vr[0];
      if (!ver) return res.status(404).json({ error: 'version not found' });
      const s = await loadSub(ver.submission_id);
      if (!s || !canSee(s)) return res.status(403).json({ error: 'not allowed' });
      if (!ver.drive_file_id) return res.status(200).json({ ok: true, status: ver.processing_status || 'processing' });
      if (!process.env.GOOGLE_SA_KEY) return res.status(200).json({ ok: true, status: ver.processing_status || 'ready' });
      const token = await driveToken('https://www.googleapis.com/auth/drive.readonly');
      const g = await driveApi(token, 'files/' + ver.drive_file_id + '?fields=id,name,mimeType,size,trashed&supportsAllDrives=true');
      let status = 'ready'; const patch = { last_synced_at: new Date().toISOString() };
      if (g.status === 404) status = 'missing';
      else if (g.status === 403) status = 'permission';
      else if (g.j && g.j.trashed) status = 'missing';
      else { status = 'ready'; if (g.j.mimeType) patch.mime_type = g.j.mimeType; if (g.j.size) patch.size_bytes = Number(g.j.size); }
      patch.processing_status = status;
      const hist = Array.isArray(ver.sync_history) ? ver.sync_history : [];
      hist.push({ at: new Date().toISOString(), event: 'sync', status });
      patch.sync_history = hist.slice(-20);
      await db(`submission_versions?id=eq.${ver.id}`, { method: 'PATCH', body: patch });
      return res.status(200).json({ ok: true, status, name: (g.j && g.j.name) || null });
    }

    // ---- Artist: start a resumable Drive upload into the project folder (returns a temp session URL)
    if (action === 'startUpload') {
      const s = await loadSub(body.submission_id);
      if (!s) return res.status(404).json({ error: 'submission not found' });
      const isOwnerArtist = s.artist_id === me.id || (s.project && s.project.artist_id === me.id);
      if (!(isStaff(me.role) || isOwnerArtist)) return res.status(403).json({ error: 'not allowed' });
      if (!process.env.GOOGLE_SA_KEY) return res.status(503).json({ error: 'Drive not configured' });
      const ROOT = process.env.DRIVE_ROOT_FOLDER;
      if (!ROOT) return res.status(503).json({ error: 'DRIVE_ROOT_FOLDER not set' });
      const token = await driveToken('https://www.googleapis.com/auth/drive');
      let folderId = s.project && s.project.drive_folder_id;
      if (!folderId) {
        const projFolder = await driveEnsureFolder(token, ROOT, (s.project && s.project.title) || 'Project');
        folderId = await driveEnsureFolder(token, projFolder, 'Masters');
        await db(`projects?id=eq.${s.project_id}`, { method: 'PATCH', body: { drive_folder_id: folderId } });
      }
      // Reflect the dashboard origin so Google enables CORS on the resumable session
      // (lets the browser PUT the bytes straight to Drive without a preflight failure).
      const origin = (req.headers.origin) || 'https://dashboard.ideal-music.net';
      const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
        method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Origin: origin },
        body: JSON.stringify({ name: body.filename || 'demo.mp3', parents: [folderId], mimeType: body.mime || 'audio/mpeg' }),
      });
      const uploadUrl = r.headers.get('location');
      if (!uploadUrl) return res.status(500).json({ error: 'no upload url', detail: await r.text() });
      return res.status(200).json({ ok: true, uploadUrl, drive_folder_id: folderId });
    }

    // ---- Rename a version's file (dashboard is source of truth → push to Drive)
    if (action === 'renameVersion') {
      if (!body.version_id || !body.name) return res.status(400).json({ error: 'version_id + name required' });
      const vr = await db(`submission_versions?id=eq.${body.version_id}&select=id,submission_id,drive_file_id,sync_history`);
      const ver = vr && vr[0];
      if (!ver) return res.status(404).json({ error: 'version not found' });
      const s = await loadSub(ver.submission_id);
      const isOwnerArtist = s && (s.artist_id === me.id || (s.project && s.project.artist_id === me.id));
      if (!s || !(isStaff(me.role) || isOwnerArtist)) return res.status(403).json({ error: 'not allowed' });
      if (ver.drive_file_id && process.env.GOOGLE_SA_KEY) {
        const token = await driveToken('https://www.googleapis.com/auth/drive');
        await driveApi(token, 'files/' + ver.drive_file_id + '?fields=id,name&supportsAllDrives=true', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: body.name }) });
      }
      const hist = Array.isArray(ver.sync_history) ? ver.sync_history : [];
      hist.push({ at: new Date().toISOString(), event: 'rename', name: body.name });
      await db(`submission_versions?id=eq.${ver.id}`, { method: 'PATCH', body: { original_filename: body.name, sync_history: hist.slice(-20) } });
      return res.status(200).json({ ok: true });
    }

    // ---- Notifications for the caller
    if (action === 'notifications') {
      const rows = await db(`notifications?user_id=eq.${me.id}&select=id,kind,title,body,read,created_at,project_id,submission_id,version_id&order=created_at.desc&limit=50`);
      const unread = (rows || []).filter((n) => !n.read).length;
      return res.status(200).json({ ok: true, notifications: rows || [], unread });
    }
    if (action === 'markNotif') {
      if (body.id) await db(`notifications?id=eq.${body.id}&user_id=eq.${me.id}`, { method: 'PATCH', body: { read: true } });
      else await db(`notifications?user_id=eq.${me.id}&read=eq.false`, { method: 'PATCH', body: { read: true } });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
