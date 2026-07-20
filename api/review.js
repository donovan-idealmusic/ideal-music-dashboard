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
      const rows = await db(`submissions?id=eq.${id}&select=id,project_id,artist_id,status,current_version,max_revisions`);
      const s = rows && rows[0];
      if (!s) return null;
      const pr = await db(`projects?id=eq.${s.project_id}&select=id,client_id,artist_id`);
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
      const ins = await db('submission_versions', {
        method: 'POST', prefer: 'return=representation',
        body: [{ submission_id: s.id, version_no: nextNo, uploader_id: me.id,
                 drive_file_id: body.drive_file_id || null, file_format: body.file_format || null,
                 duration_sec: body.duration_sec || null, revision_summary: body.revision_summary || null }],
      });
      // (submission.status + current_version + status_history + audit are set by the DB trigger)
      const v = ins[0];
      return res.status(200).json({ ok: true, version: { id: v.id, version_no: v.version_no } });
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
      const versions = await db(`submission_versions?submission_id=eq.${s.id}&select=id,version_no,drive_file_id,file_format,duration_sec,revision_summary,decision,deadline_next,is_locked,created_at&order=version_no.asc`);
      const vIds = versions.map((v) => v.id);
      let feedback = [], items = [], comments = [];
      if (vIds.length) {
        const inList = '(' + vIds.join(',') + ')';
        feedback = await db(`feedback?version_id=in.${inList}&select=id,version_id,general_text,priority,created_at&order=created_at.asc`);
        items    = await db(`revision_items?version_id=in.${inList}&select=id,version_id,category,body,level,completed`);
        comments = await db(`timestamped_comments?version_id=in.${inList}&select=id,version_id,ts_sec,body,created_at&order=ts_sec.asc`);
      }
      // messages: only delivered ones, stripped of sender identity
      const msgs = await db(`messages?project_id=eq.${s.project_id}&status=eq.delivered&select=id,sender_role,body,created_at&order=created_at.asc`);
      return res.status(200).json({ ok: true, submission: { id: s.id, status: s.status, current_version: s.current_version },
        versions, feedback, items, comments, messages: msgs });
    }

    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
