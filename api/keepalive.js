// Called once a day by Vercel Cron so the free Supabase project never pauses for inactivity.
const SUPABASE_URL = 'https://dtomacgviokomomwqagr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1zCKKS3P5krHdgZLWquLAg_P-9M6JG5';

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_set_by_code`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: 'KEEPALIVE' }),
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e) });
  }
}
