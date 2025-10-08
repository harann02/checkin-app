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
  let body = {};

  // map local action names to Apps Script admin actions
  if (incoming.action === 'saveSite') {
    body = {
      adminAction: 'upsertSite',
      adminToken: process.env.ADMIN_TOKEN,
      siteName: incoming.site.siteName,
      lat: incoming.site.lat,
      lng: incoming.site.lng,
      radiusM: incoming.site.radiusM
    };
  } else if (incoming.action === 'deleteSite') {
    body = {
      adminAction: 'deleteSite',
      adminToken: process.env.ADMIN_TOKEN,
      siteName: incoming.siteName
    };
  } else if (incoming.action === 'listSites') {
    body = {
      adminAction: 'listSites',
      adminToken: process.env.ADMIN_TOKEN
    };
  } else {
    return res.status(400).json({ ok: false, error: 'unknown_action' });
  }

  try {
    const resp = await fetch(process.env.APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await resp.json();
    return res.status(200).json(result);
  } catch (err) {
    console.error('Google Script Error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

// test redeploy
