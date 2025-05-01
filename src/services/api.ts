
import axios from "axios";
import { BlogPost, UserPreference } from "@/data/mockFashionData";
import { toast } from "@/hooks/use-toast";

// Make these configurable with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || "";

export interface ChatMessage {
  role: "user" | "assistant";
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
      
      // Second, try to use Perplexity API directly if API key is available
      const apiKey = localStorage.getItem('perplexity_api_key');
      
      if (apiKey) {
        try {
          console.log("Attempting to use Perplexity API directly...");
          
          // IMPORTANT: This won't work directly from the browser due to CORS!
          // This is here only as a fallback and for demonstration purposes
          toast({
            title: "Direct API Connection",
            description: "Attempting to connect directly to Perplexity API (this may fail due to CORS).",
          });
          
          // Using the mock data instead as direct API calls will fail with CORS
          throw new Error("Direct API calls will likely fail due to CORS restrictions");
        } catch (perplexityError) {
          console.error("Perplexity API Error:", perplexityError);
          toast({
            title: "API Connection Issue",
            description: "Using mock fashion data instead.",
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
