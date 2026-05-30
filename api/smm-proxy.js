export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { apiUrl, apiKey, ...params } = payload;

    if (!apiUrl || !apiKey || !params.action) {
      return res.status(400).json({ error: 'Missing apiUrl, apiKey or action' });
    }

    const upstreamBody = new URLSearchParams({
      key: String(apiKey),
      ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'FlexaPanel-API-Proxy/1.0'
      },
      body: upstreamBody,
      signal: controller.signal
    });

    clearTimeout(timeout);

    const text = await upstream.text();
    try {
      return res.status(upstream.status).json(JSON.parse(text));
    } catch {
      return res.status(upstream.status).json({ raw: text, error: upstream.ok ? undefined : text });
    }
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'SMM provider timeout' : (error?.message || 'Proxy error');
    return res.status(500).json({ error: message });
  }
}