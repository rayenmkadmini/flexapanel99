// Supabase Edge Function proxy for SMM Panel APIs.
// Deploy it once, then use:
// https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const { apiUrl, apiKey, ...params } = payload;

    if (!apiUrl || !apiKey || !params.action) {
      return new Response(JSON.stringify({ error: 'Missing apiUrl, apiKey or action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = new URLSearchParams({
      key: String(apiKey),
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value ?? '')]),
      ),
    });

    const upstream = await fetch(String(apiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'FlexaPanel-Supabase-Proxy/1.0',
      },
      body,
    });

    const text = await upstream.text();
    let responseBody: unknown;
    try {
      responseBody = JSON.parse(text);
    } catch {
      responseBody = { raw: text, error: upstream.ok ? undefined : text };
    }

    return new Response(JSON.stringify(responseBody), {
      status: upstream.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Proxy error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});