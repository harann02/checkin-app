// /api/admin-sites.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const ENDPOINT = process.env.APPS_SCRIPT_ENDPOINT; // your Apps Script URL
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;       // secret token

    // what to send to Google Apps Script
    let body = {};
    if (req.method === 'GET') {
      body = { adminAction: 'listSites', adminToken: ADMIN_TOKEN };
    } else if (req.method === 'POST') {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      body = { ...incoming, adminToken: ADMIN_TOKEN };
    } else {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }

    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { ok: false, error: text.slice(0,200) || 'non_json_response' }; }

    res.status(r.ok ? 200 : 400).json(data);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
