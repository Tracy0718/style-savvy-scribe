
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
      // First, try to use Perplexity API directly if API key is available
      const apiKey = localStorage.getItem('perplexity_api_key');
      
      if (apiKey) {
        try {
          console.log("Attempting to use Perplexity API directly...");
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                {
                  role: 'system',
                  content: `You are a knowledgeable and friendly fashion assistant with real-time access to current fashion trends and data. 
                  ${userPreferences ? `Consider these user preferences: ${JSON.stringify(userPreferences)}` : ''}
                  
                  Guidelines:
                  1. Provide specific, actionable fashion advice
                  2. Reference current trends and seasonal recommendations
                  3. Consider user preferences when making suggestions
                  4. Be conversational but professional
                  5. If suggesting products or styles, explain why they would work
                  6. For visual requests, describe items in detail
                  7. Stay updated with 2025 fashion trends
                  
                  Remember to be precise, helpful, and engaging in your responses.`
                },
                ...messages
              ],
              temperature: 0.7,
              top_p: 0.9,
              max_tokens: 1000,
              frequency_penalty: 0.5,
              presence_penalty: 0.5,
            }),
          });

          if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.statusText}`);
          }

          const data = await response.json();
          
          // Check for recommended content in the response
          let recommendedPosts: BlogPost[] = [];
          const content = data.choices[0].message.content;
          
          // Get mock data for recommended articles as Perplexity doesn't directly return them
          if (content.toLowerCase().includes("recommend") || 
              content.toLowerCase().includes("suggest") || 
              content.toLowerCase().includes("trend")) {
            const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
            // Get random posts for more variety
            const shuffled = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random());
            recommendedPosts = shuffled.slice(0, 3);
          }
          
          return {
            reply: data.choices[0].message.content,
            suggested_options: data.related_questions || [
              "What are the latest fashion trends?",
              "How can I style a basic outfit?",
              "What colors are popular this season?",
              "Recommend sustainable fashion brands"
            ],
            recommended_articles: recommendedPosts,
          };
        } catch (perplexityError) {
          console.error("Perplexity API Error:", perplexityError);
          toast({
            title: "API Connection Issue",
            description: "Unable to connect to Perplexity API. Using fallback options.",
            variant: "destructive",
          });
          // Continue to fallback
        }
      }

      // Try using our mock API since Supabase URL might not be available
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
