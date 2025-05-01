
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

    // Check if PERPLEXITY_API_KEY is available
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY not found in environment variables');
    }

    // Enhanced system message with more context and capabilities
    const systemMessage = {
      role: 'system',
      content: `You are a knowledgeable and friendly fashion assistant with real-time access to current fashion trends and data. 
      ${user_preferences ? `Consider these user preferences: ${JSON.stringify(user_preferences)}` : ''}
      
      Guidelines:
      1. Provide specific, actionable fashion advice
      2. Reference current trends and seasonal recommendations
      3. Consider user preferences when making suggestions
      4. Be conversational but professional
      5. If suggesting products or styles, explain why they would work
      6. For visual requests, describe items in detail
      7. Stay updated with 2025 fashion trends
      
      Remember to be precise, helpful, and engaging in your responses.`
    };

    console.log("Sending request to Perplexity API with system message:", systemMessage);

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
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from Perplexity API:", data);

    // Enhanced response formatting
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
    console.error('Edge Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to process your request. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
