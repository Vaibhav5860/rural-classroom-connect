export default async function handler(req, res) {
  const backend = process.env.BACKEND_URL;
  if (!backend) {
    return res.status(500).json({ ok: false, error: 'BACKEND_URL not set on Vercel' });
  }

  try {
    const url = new URL('/api/health', backend).toString();
    const r = await fetch(url, { method: 'GET' });
    const data = await r.text();
    // try parse
    try {
      const json = JSON.parse(data);
      res.status(r.status).json(json);
    } catch (e) {
      res.status(r.status).send(data);
    }
  } catch (err) {
    console.error('[proxy-health] error', err.stack || err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}