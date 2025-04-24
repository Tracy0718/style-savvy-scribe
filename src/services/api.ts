
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
      // First, try to use the Supabase Edge Function with Perplexity
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
    } catch (error) {
      console.error('Chat API Error:', error);
      
      // Show error toast if both APIs fail
      toast({
        title: "Connection Error",
        description: "Unable to connect to the fashion assistant. Please try again.",
        variant: "destructive",
      });
      
      // Throw the error to be handled by the component
      throw error;
    }
  },
};
