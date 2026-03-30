import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, code, redirect_uri } = await req.json();

    const CLIENT_ID = Deno.env.get("ATLASSIAN_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("ATLASSIAN_CLIENT_SECRET");

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Atlassian OAuth não configurado. Adicione ATLASSIAN_CLIENT_ID e ATLASSIAN_CLIENT_SECRET." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === "get_auth_url") {
      const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${CLIENT_ID}&scope=read%3Ame&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&prompt=consent`;
      return new Response(
        JSON.stringify({ url: authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === "exchange_code") {
      // Exchange authorization code for access token
      const tokenRes = await fetch("https://auth.atlassian.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri,
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        return new Response(
          JSON.stringify({ error: tokenData.error_description || "Falha ao trocar código por token." }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user info from Atlassian
      const userRes = await fetch("https://api.atlassian.com/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        return new Response(
          JSON.stringify({ error: "Falha ao obter dados do usuário." }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          user: {
            email: userData.email,
            displayName: userData.name || userData.nickname || userData.email,
            avatarUrl: userData.picture,
            accountId: userData.account_id,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ação inválida." }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
