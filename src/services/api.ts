
import axios from "axios";
import { BlogPost, UserPreference } from "@/data/mockFashionData";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL;

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
  async sendChatMessage(messages: ChatMessage[], userPreferences?: UserPreference[]) {
    try {
      // First, try to use Perplexity API directly if API key is available
      const apiKey = localStorage.getItem('perplexity_api_key');
      
      if (apiKey) {
        try {
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
              return_images: true,
              return_related_questions: true,
              frequency_penalty: 0.5,
              presence_penalty: 0.5,
              search_domain_filter: ['perplexity.ai'],
              search_recency_filter: 'day', // Get the most recent fashion data
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
            recommendedPosts = MOCK_BLOG_POSTS.slice(0, 3);
          }
          
          return {
            reply: data.choices[0].message.content,
            suggested_options: data.related_questions || [],
            recommended_articles: recommendedPosts,
          };
        } catch (perplexityError) {
          console.error("Perplexity API Error:", perplexityError);
          toast({
            title: "API Error",
            description: "Perplexity API request failed. Check your API key or network connection.",
            variant: "destructive",
          });
          
          // Continue to fallback
        }
      }

      // Fallback to Supabase function if no API key is available or Perplexity failed
      try {
        if (!SUPABASE_FUNCTION_URL) {
          throw new Error("Supabase Function URL is not defined");
        }
        
        const response = await fetch(`${SUPABASE_FUNCTION_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages,
            user_preferences: userPreferences?.reduce((prefs, pref) => {
              prefs[pref.name] = pref.value;
              return prefs;
            }, {} as Record<string, string>),
          }),
        });

        if (!response.ok) {
          throw new Error(`Supabase function failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data as ChatResponse;
      } catch (supabaseError) {
        console.error("Supabase Function Error:", supabaseError);
        // Fall through to the last resort fallback
      }
      
      // Last resort: Use mock data
      toast({
        title: "Using Offline Mode",
        description: "Connected to backend failed. Using mock data instead.",
      });
      
      const { MOCK_BLOG_POSTS } = await import("@/data/mockFashionData");
      return {
        reply: "I've found some fashion content that might interest you.",
        suggested_options: [
          "Show me the latest trends",
          "Give me fashion tips for spring",
          "How to accessorize an outfit?",
          "What colors are trending this season?",
        ],
        recommended_articles: MOCK_BLOG_POSTS.slice(0, 3),
      } as ChatResponse;
      
    } catch (error) {
      console.error('Chat API Error:', error);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the fashion assistant. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
};
