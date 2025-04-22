
import axios from "axios";
import { BlogPost, UserPreference } from "@/data/mockFashionData";

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
        throw new Error('Supabase function failed');
      }

      const data = await response.json();
      return data as ChatResponse;
    } catch (error) {
      // Fallback to the original API if Supabase function fails
      const response = await axios.post<ChatResponse>(
        `${API_BASE_URL}/chat`, 
        {
          messages,
          user_preferences: userPreferences?.reduce((prefs, pref) => {
            prefs[pref.name] = pref.value;
            return prefs;
          }, {} as Record<string, string>),
        }
      );
      return response.data;
    }
  },
};
