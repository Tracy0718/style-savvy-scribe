
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, user_preferences } = await req.json();

    // Enhance the system message with user preferences
    const systemMessage = {
      role: 'system',
      content: `You are a helpful and knowledgeable fashion assistant. ${
        user_preferences ? `Consider these user preferences: ${JSON.stringify(user_preferences)}` : ''
      }. Be precise and concise in your responses. If the user asks for visual content, recommend relevant fashion items or outfits.`
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: true,
        return_related_questions: true,
      }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        reply: data.choices[0].message.content,
        suggested_options: data.related_questions || [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
