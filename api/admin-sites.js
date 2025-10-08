// /api/admin-sites.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const ENDPOINT = process.env.APPS_SCRIPT_ENDPOINT;  // your Google Apps Script URL
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;        // secret token

    if (!ENDPOINT) throw new Error('Missing APPS_SCRIPT_ENDPOINT');

    let body = {};
    if (req.method === 'GET') {
      body = { adminAction: 'listSites', adminToken: ADMIN_TOKEN };
    } else if (req.method === 'POST') {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      body = { ...incoming, adminToken: ADMIN_TOKEN };
    } else {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
// test redeploy
