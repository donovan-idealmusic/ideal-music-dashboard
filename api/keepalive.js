// Vercel Cron keep-alive.
// Runs daily (see vercel.json) and pings the Supabase project so the free-tier
// database never pauses from inactivity. The anon/publishable key is public.
export default async function handler(req, res) {
  const key = 'sb_publishable_I7XfLRs48wPtgL8FV3MxDA_oL8QO9G9';
  const url = 'https://uazinektdhnqibwznnmu.supabase.co/rest/v1/?apikey=' + key;
  try {
    const r = await fetch(url, { headers: { apikey: key } });
    return res.status(200).json({ ok: true, supabase: r.status, at: new Date().toISOString() });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e), at: new Date().toISOString() });
  }
}
