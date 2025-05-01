
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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

    // Check if GEMINI_API_KEY is available
    if (!GEMINI_API_KEY) {
      console.log("Using provided API Key as environment variable is not available");
    }
    
    // Use provided key or the one from environment
    const apiKey = GEMINI_API_KEY || "AIzaSyBUZ_IGvL8kLvHNuS9lCrGIq8QJ6AJxDGs";

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

    console.log("Sending request to Gemini API with system message:", systemMessage);

    // Format messages for Gemini API - now using the correct format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Add system message at the beginning - as a user message with special prefix
    formattedMessages.unshift({
      role: "user",
      parts: [{ text: "System: " + systemMessage.content }]
    });

    // Make request to the correct Gemini API endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from Gemini API:", data);

    // Extract the response content from Gemini API structure
    const replyContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request.";

    // Enhanced response formatting
    return new Response(
      JSON.stringify({
        reply: replyContent,
        suggested_options: [
          "What are the latest fashion trends?",
          "How can I style a basic outfit?",
          "What colors are popular this season?",
          "Recommend sustainable fashion brands"
        ],
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
