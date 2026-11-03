export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: cors });
    try {
      const upstream = await fetch("http://163.5.63.174:30120/dynamic.json", {
        headers: { "Accept": "application/json" },
        cf: { cacheTtl: 0, cacheEverything: false }
      });
      if (!upstream.ok) return new Response(JSON.stringify({ error: "FiveM server unavailable" }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
      const data = await upstream.json();
      return new Response(JSON.stringify({
        clients: Number(data.clients) || 0,
        sv_maxclients: Number(data.sv_maxclients) || 8,
        hostname: data.hostname || "AURORA CITY ROLEPLAY"
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Could not reach FiveM server" }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
