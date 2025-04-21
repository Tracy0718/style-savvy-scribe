
# Style Savvy Scribe: Fashion Blog Aggregator Chatbot

This project is a fashion blog aggregator that delivers content in a personalized, conversational format. The frontend is built with React and styled with Tailwind CSS, featuring a chatbot interface that allows users to discover fashion content based on their preferences.

## Current Implementation (Frontend Demo)

The current implementation is a frontend demo that uses mock data to simulate the functionality of a fashion blog aggregator chatbot. In a production environment, this would be connected to a backend that fetches real data from fashion blogs and processes it with an AI model.

### Features

- Conversational chatbot interface
- Fashion blog post recommendations
- User preference settings (style, season, theme)
- Responsive design optimized for mobile and desktop

## Connecting to a Real Backend

To turn this demo into a fully functional application, you would need to implement a backend with the following components:

### 1. Data Fetching Layer

```python
# Example using FastAPI and requests in Python
from fastapi import FastAPI
from bs4 import BeautifulSoup
import requests
import feedparser
import json
from datetime import datetime
import schedule
import time

app = FastAPI()

# Fashion blog sources
FASHION_SOURCES = [
    {"name": "Vogue", "rss_url": "https://www.vogue.com/feed/rss"},
    {"name": "Harper's Bazaar", "rss_url": "https://www.harpersbazaar.com/rss/all.xml/"},
    {"name": "Elle", "rss_url": "https://www.elle.com/rss/all.xml/"},
    # Add more sources as needed
]

# Database to store fetched articles
fashion_articles = []

def fetch_rss_feeds():
    """Fetch and parse articles from RSS feeds"""
    new_articles = []
    
    for source in FASHION_SOURCES:
        try:
            feed = feedparser.parse(source["rss_url"])
            
            for entry in feed.entries:
                article = {
                    "id": str(hash(entry.link)),
                    "title": entry.title,
                    "excerpt": entry.summary[:200] + "..." if len(entry.summary) > 200 else entry.summary,
                    "content": entry.summary,
                    "imageUrl": extract_image_from_content(entry.summary) if hasattr(entry, "summary") else "",
                    "source": source["name"],
                    "publishedAt": datetime.strftime(
                        datetime.strptime(entry.published, "%a, %d %b %Y %H:%M:%S %z") 
                        if hasattr(entry, "published") else datetime.now(),
                        "%Y-%m-%d"
                    ),
                    "url": entry.link,
                    "categories": extract_categories(entry),
                    "tags": extract_tags(entry),
                }
                new_articles.append(article)
        except Exception as e:
            print(f"Error fetching from {source['name']}: {str(e)}")
    
    # Update the database with new articles
    global fashion_articles
    fashion_articles = new_articles + fashion_articles
    
    # Keep only the latest 100 articles
    fashion_articles = fashion_articles[:100]
    
    print(f"Fetched {len(new_articles)} new articles. Total: {len(fashion_articles)}")

def extract_image_from_content(content):
    """Extract first image URL from HTML content"""
    soup = BeautifulSoup(content, "html.parser")
    img_tag = soup.find("img")
    return img_tag["src"] if img_tag and "src" in img_tag.attrs else ""

def extract_categories(entry):
    """Extract categories from RSS entry"""
    if hasattr(entry, "tags"):
        return [tag.term for tag in entry.tags if hasattr(tag, "term")]
    return []

def extract_tags(entry):
    """Extract tags/keywords from RSS entry"""
    # This is a simplified implementation
    # In a real app, you might use NLP to extract keywords from the content
    keywords = []
    if hasattr(entry, "summary"):
        # Example: detect basic fashion-related keywords
        fashion_keywords = ["trend", "style", "collection", "season", "designer"]
        for keyword in fashion_keywords:
            if keyword.lower() in entry.summary.lower():
                keywords.append(keyword.capitalize())
    return keywords[:5]  # Limit to 5 tags

# Schedule regular updates
def schedule_updates():
    schedule.every(6).hours.do(fetch_rss_feeds)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

# API endpoints
@app.get("/api/articles")
async def get_articles(
    category: str = None, 
    tag: str = None, 
    season: str = None,
    limit: int = 10
):
    """Get fashion articles with optional filtering"""
    filtered_articles = fashion_articles
    
    if category:
        filtered_articles = [a for a in filtered_articles if category in a["categories"]]
    
    if tag:
        filtered_articles = [a for a in filtered_articles if tag in a["tags"]]
    
    if season:
        # Simple season filtering (could be more sophisticated)
        filtered_articles = [a for a in filtered_articles if season.lower() in a["content"].lower()]
    
    return filtered_articles[:limit]

# Start the initial fetch
fetch_rss_feeds()

# In a production app, you would run the scheduler in a separate thread
# import threading
# scheduler_thread = threading.Thread(target=schedule_updates)
# scheduler_thread.daemon = True
# scheduler_thread.start()
```

### 2. AI/Chatbot Layer

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from typing import List, Optional

app = FastAPI()

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    user_preferences: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_options: Optional[List[str]] = None
    recommended_articles: Optional[List[dict]] = None

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Format messages for OpenAI API
    formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    # Add system message with context
    system_message = {
        "role": "system", 
        "content": "You are a fashion assistant that helps users discover content from fashion blogs. "
                  "You should be knowledgeable about fashion trends, styles, and provide personalized recommendations."
    }
    
    # Add user preference context if available
    if request.user_preferences:
        pref_message = "The user has the following preferences: "
        for key, value in request.user_preferences.items():
            pref_message += f"{key}: {value}, "
        system_message["content"] += f"\n\n{pref_message.rstrip(', ')}."
    
    # Prepend system message
    formatted_messages = [system_message] + formatted_messages
    
    try:
        # Get response from OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # Use an appropriate model
            messages=formatted_messages,
            max_tokens=500,
            temperature=0.7
        )
        
        reply = response.choices[0].message["content"]
        
        # Parse the response to extract suggested options or recommended articles
        # This is a simplified implementation
        suggested_options = []
        if "Here are some options:" in reply:
            options_text = reply.split("Here are some options:")[1].split("\n")
            suggested_options = [opt.strip("- ") for opt in options_text if opt.strip().startswith("-")]
        
        # For a complete implementation, you would also need to query your article database
        # to get recommended articles based on the AI response
        
        return ChatResponse(
            reply=reply,
            suggested_options=suggested_options,
            recommended_articles=[]  # Would be populated from your article database
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. Database Integration

For a production app, you would use a proper database instead of in-memory storage. MongoDB or PostgreSQL would be good choices:

#### MongoDB Example:

```python
from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["fashion_aggregator"]
articles_collection = db["articles"]
user_preferences_collection = db["user_preferences"]

# Save articles to database
def save_articles(articles):
    for article in articles:
        # Ensure we don't create duplicates
        articles_collection.update_one(
            {"url": article["url"]},  # Find by URL
            {"$set": article},        # Update with new data
            upsert=True               # Insert if not found
        )

# Get articles with filtering
def get_articles(filters=None, limit=10):
    query = {}
    if filters:
        if "category" in filters:
            query["categories"] = filters["category"]
        if "tag" in filters:
            query["tags"] = filters["tag"]
        if "search" in filters:
            query["$or"] = [
                {"title": {"$regex": filters["search"], "$options": "i"}},
                {"content": {"$regex": filters["search"], "$options": "i"}}
            ]
    
    return list(articles_collection.find(query).limit(limit))

# Save user preferences
def save_user_preferences(user_id, preferences):
    user_preferences_collection.update_one(
        {"user_id": user_id},
        {"$set": {"preferences": preferences}},
        upsert=True
    )

# Get user preferences
def get_user_preferences(user_id):
    user_data = user_preferences_collection.find_one({"user_id": user_id})
    return user_data["preferences"] if user_data else {}
```

## Integration with the Frontend

To connect this React frontend with the backend, you would:

1. Replace the mock data in `src/data/mockFashionData.ts` with API calls.
2. Create an API client service:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggested_options?: string[];
  recommended_articles?: BlogPost[];
}

export const api = {
  // Get articles with optional filtering
  async getArticles(filters?: {
    category?: string;
    tag?: string;
    season?: string;
    search?: string;
    limit?: number;
  }) {
    const response = await axios.get(`${API_BASE_URL}/articles`, { params: filters });
    return response.data;
  },
  
  // Send chat message to the AI
  async sendChatMessage(messages: ChatMessage[], userPreferences?: any) {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      messages,
      user_preferences: userPreferences
    });
    return response.data as ChatResponse;
  },
  
  // Save user preferences
  async saveUserPreferences(userId: string, preferences: any) {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/preferences`, preferences);
    return response.data;
  },
  
  // Get user preferences
  async getUserPreferences(userId: string) {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/preferences`);
    return response.data;
  }
};
```

3. Update the `ChatInterface.tsx` component to use this API service instead of mock data.

## Deployment

For deployment, you would:

1. Deploy the Backend:
   - Use a service like AWS, Google Cloud, or Heroku for the Python backend
   - Set up a MongoDB Atlas or PostgreSQL database

2. Deploy the Frontend:
   - Build the React app with `npm run build`
   - Deploy to services like Vercel, Netlify, or AWS Amplify

3. Set up CORS and environment variables appropriately for both environments

## Conclusion

This implementation gives you a solid foundation for a fashion blog aggregator chatbot. By connecting it to a real backend with live data and AI processing, you can create a truly personalized and interactive fashion discovery experience.
