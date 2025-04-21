
import axios from "axios";
import { BlogPost, UserPreference } from "@/data/mockFashionData";

// Adjust this if your backend uses a different port or URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggested_options?: string[];
  recommended_articles?: BlogPost[];
}

// For real use, you'd want a user/session id too!
export const api = {
  async sendChatMessage(messages: ChatMessage[], userPreferences?: UserPreference[]) {
    const payload = {
      messages,
      user_preferences: userPreferences?.reduce((prefs, pref) => {
        prefs[pref.name] = pref.value;
        return prefs;
      }, {} as Record<string, string>),
    };
    const response = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat`, 
      payload
    );
    return response.data;
  },
};
