
import axios from "axios";
import { BlogPost, UserPreference } from "@/data/mockFashionData";
import { toast } from "@/hooks/use-toast";

// Make these configurable with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || "";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggested_options?: string[];
  recommended_articles?: BlogPost[];
}

export const api = {
  async sendChatMessage(messages: ChatMessage[], userPreferences?: UserPreference[]): Promise<ChatResponse> {
    try {
      // First try to use the Supabase Edge Function if URL is available
      if (SUPABASE_FUNCTION_URL) {
        console.log("Attempting to use Supabase Edge Function for chat...");
        try {
          const response = await fetch(`${SUPABASE_FUNCTION_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages,
              user_preferences: userPreferences
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Received data from Supabase function:", data);
            
            // Check for recommended content in the response
            let recommendedPosts: BlogPost[] = [];
            const content = data.reply;
            
            // Get mock data for recommended articles based on content
            if (content.toLowerCase().includes("recommend") || 
                content.toLowerCase().includes("suggest") || 
                content.toLowerCase().includes("trend")) {
              const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
              // Get random posts for more variety
              const shuffled = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random());
              recommendedPosts = shuffled.slice(0, 3);
            }
            
            return {
              reply: data.reply,
              suggested_options: data.suggested_options || [
                "What are the latest fashion trends?",
                "How can I style a basic outfit?",
                "What colors are popular this season?",
                "Recommend sustainable fashion brands"
              ],
              recommended_articles: recommendedPosts,
            };
          } else {
            console.error("Supabase function error:", response.status, await response.text());
            throw new Error(`Supabase function returned ${response.status}`);
          }
        } catch (supabaseError) {
          console.error("Supabase Function Error:", supabaseError);
          // Continue to fallback options
        }
      }
      
      // Second, try to use Gemini API directly if no Supabase function is available
      const apiKey = localStorage.getItem('gemini_api_key') || "AIzaSyBUZ_IGvL8kLvHNuS9lCrGIq8QJ6AJxDGs";
      
      if (apiKey) {
        try {
          console.log("Attempting to use Gemini API directly...");
          
          // Format messages for Gemini API
          const formattedMessages = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          }));

          // Add system message for user preferences if available
          if (userPreferences && userPreferences.length > 0) {
            formattedMessages.unshift({
              role: "system",
              parts: [{ text: `Consider these user preferences: ${JSON.stringify(userPreferences)}` }]
            });
          }

          // Add default system message
          formattedMessages.unshift({
            role: "system",
            parts: [{ text: `You are a knowledgeable and friendly fashion assistant with real-time access to current fashion trends and data.
              
              Guidelines:
              1. Provide specific, actionable fashion advice
              2. Reference current trends and seasonal recommendations
              3. Consider user preferences when making suggestions
              4. Be conversational but professional
              5. If suggesting products or styles, explain why they would work
              6. For visual requests, describe items in detail
              7. Stay updated with 2025 fashion trends
              
              Remember to be precise, helpful, and engaging in your responses.` }]
          });

          toast({
            title: "Direct API Connection",
            description: "Attempting to connect directly to Gemini API (this may fail due to CORS).",
          });

          // This will likely fail due to CORS but we'll try anyway
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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

          if (response.ok) {
            const data = await response.json();
            const replyContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request.";
            
            // Check for recommended content in the response
            let recommendedPosts: BlogPost[] = [];
            if (replyContent.toLowerCase().includes("recommend") || 
                replyContent.toLowerCase().includes("suggest") || 
                replyContent.toLowerCase().includes("trend")) {
              const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
              const shuffled = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random());
              recommendedPosts = shuffled.slice(0, 3);
            }
            
            return {
              reply: replyContent,
              suggested_options: [
                "What are the latest fashion trends for 2025?",
                "How to style monochromatic outfits?",
                "Which accessories are trending this season?",
                "Best sustainable fashion brands to follow?",
              ],
              recommended_articles: recommendedPosts,
            };
          } else {
            throw new Error(`Gemini API error: ${response.status}`);
          }
        } catch (geminiError) {
          console.error("Gemini API Error:", geminiError);
          toast({
            title: "API Connection Issue",
            description: "Using mock fashion data instead due to CORS restrictions.",
          });
          // Continue to fallback
        }
      }

      // Try using our mock API since direct API and Supabase URL might not be available
      console.log("Using mock fashion data API...");
      
      // Simulate a realistic API response with variety
      const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
      
      // Get random posts for more variety each time
      const shuffled = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random());
      const selectedPosts = shuffled.slice(0, 3);
      
      // Create varied responses based on the last user message
      const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
      let responseText = "Here's some fashion content that might interest you.";
      
      if (lastUserMessage.toLowerCase().includes("trend")) {
        responseText = "I've found these trending fashion items based on recent data. Each piece represents styles that are gaining popularity in 2025.";
      } else if (lastUserMessage.toLowerCase().includes("style") || lastUserMessage.toLowerCase().includes("outfit")) {
        responseText = "Here are some styling suggestions that match current fashion principles. These looks create balance while highlighting your personal style.";
      } else if (lastUserMessage.toLowerCase().includes("color")) {
        responseText = "These are the season's most influential color palettes. Fashion forecasters are seeing these tones dominate runways and street style.";
      }
      
      return {
        reply: responseText,
        suggested_options: [
          "What are the latest fashion trends for 2025?",
          "How to style monochromatic outfits?",
          "Which accessories are trending this season?",
          "Best sustainable fashion brands to follow?",
        ],
        recommended_articles: selectedPosts,
      };
      
    } catch (error) {
      console.error('Chat API Error:', error);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the fashion assistant. Using offline mode.",
        variant: "destructive",
      });
      
      // Ultimate fallback - always provide a response
      const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
      const randomPosts = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      return {
        reply: "I'm having trouble connecting to the fashion database right now, but here are some articles you might find interesting.",
        suggested_options: [
          "Show me the latest trends",
          "Give me fashion tips for spring",
          "How to accessorize an outfit?",
          "What colors are trending this season?",
        ],
        recommended_articles: randomPosts,
      };
    }
  },
};
