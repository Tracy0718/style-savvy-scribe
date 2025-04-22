import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";
import ChatOption from "./ChatOption";
import BlogPostCard from "./BlogPostCard";
import UserPreferences from "./UserPreferences";
import { 
  BlogPost, 
  CHATBOT_FLOWS, 
  MOCK_BLOG_POSTS,
  UserPreference,
  getRecommendedPosts 
} from "@/data/mockFashionData";
import { api, ChatMessage as APIChatMessage } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [currentFlow, setCurrentFlow] = useState("greeting");
  const [showingResults, setShowingResults] = useState(false);
  const [recommendedPosts, setRecommendedPosts] = useState<BlogPost[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<APIChatMessage[]>([]);
  const [showPhotos, setShowPhotos] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage("Hi! I'm your personal Style Savvy Scribe. What fashion topics are you interested in?");
      setOptions([
        "Show me the latest trends",
        "Give me some fashion tips",
        "I want style inspiration",
        "Set my preferences",
      ]);
      setCurrentFlow("greeting");
      setChatHistory([
        { role: "assistant", content: "Hi! I'm your personal Style Savvy Scribe. What fashion topics are you interested in?" }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36),
      text,
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatHistory(prev => [...prev, { role: "assistant", content: text }]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatHistory(prev => [...prev, { role: "user", content: text }]);
  };

  const shouldShowPhotos = (text: string) =>
    /(photo|see (photos|pictures)|show( me)? (photos|pictures|articles))/i.test(text);

  const handleSimpleGreeting = (text: string) => {
    const greetings = {
      hi: {
        response: "Hi there! I'm excited to chat about fashion with you. Are you looking for:",
        options: [
          "Latest fashion trends",
          "Personal style advice",
          "Fashion tips for an occasion",
          "Shopping recommendations"
        ]
      },
      hello: {
        response: "Hello! I'd love to discuss fashion with you. What interests you most:",
        options: [
          "Seasonal fashion trends",
          "Wardrobe essentials",
          "Style inspiration",
          "Fashion tips"
        ]
      },
      "how are you": {
        response: "I'm doing great! Ready to talk about all things fashion. What would you like to explore:",
        options: [
          "Current fashion trends",
          "Style advice",
          "Fashion inspiration",
          "Wardrobe tips"
        ]
      },
      hey: {
        response: "Hey! Let's dive into fashion topics. What catches your interest:",
        options: [
          "Latest trends",
          "Personal styling",
          "Fashion advice",
          "Style inspiration"
        ]
      }
    };

    const textLower = text.toLowerCase();
    for (const [key, value] of Object.entries(greetings)) {
      if (textLower.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const isFashionRelated = (text: string): boolean => {
    const keywords = [
      "fashion", "style", "clothes", "clothing", "outfit", "trend", "designer", 
      "haute couture", "streetwear", "wardrobe", "look", "runway", "apparel", 
      "season", "accessory", "shopping", "wear", "brand", "tips", "blog",
      "inspiration", "dress", "footwear", "sneaker", "bag", "jewelry", "beauty", 
      "textile", "menswear", "womenswear"
    ];
    const textLower = text.toLowerCase();
    return keywords.some((word) => textLower.includes(word));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check for simple greetings first
    const greetingResponse = handleSimpleGreeting(input);
    if (greetingResponse) {
      addUserMessage(input);
      addBotMessage(greetingResponse.response);
      setOptions(greetingResponse.options);
      setInput("");
      return;
    }

    // If not a greeting, check if fashion-related
    if (!isFashionRelated(input)) {
      toast({
        title: "Sorry!",
        description: "I can only answer questions related to fashion. Please ask something about trends, outfits, style, or similar topics!",
        variant: "destructive",
      });
      setInput("");
      return;
    }

    addUserMessage(input);
    setInput("");
    setShowPhotos(shouldShowPhotos(input));
    await sendToApi(input, shouldShowPhotos(input));
  };

  const handleOptionClick = async (option: string) => {
    if (!isFashionRelated(option)) {
      toast({
        title: "Sorry!",
        description: "I can only answer questions related to fashion. Please ask something about trends, outfits, style, or similar topics!",
        variant: "destructive",
      });
      return;
    }
    addUserMessage(option);
    setShowPhotos(shouldShowPhotos(option));
    await sendToApi(option, shouldShowPhotos(option));
  };

  const sendToApi = async (userInput: string, showPhotosFlag: boolean) => {
    setLoading(true);
    setOptions([]);
    try {
      const result = await api.sendChatMessage([...chatHistory, { role: "user", content: userInput }], userPreferences);
      if (result.reply) {
        addBotMessage(result.reply);
      }
      if (result.suggested_options && result.suggested_options.length > 0) {
        setOptions(result.suggested_options);
      } else {
        setOptions([]);
      }
      if (result.recommended_articles && result.recommended_articles.length > 0) {
        setRecommendedPosts(result.recommended_articles);
        setShowingResults(true);
      } else {
        setRecommendedPosts([]);
        setShowingResults(false);
      }
      setShowPhotos(showPhotosFlag);
    } catch (err: any) {
      toast({
        title: "Network error",
        description: "Failed to connect to backend. Showing mock recommendations.",
        variant: "destructive",
      });
      processUserInput(userInput, showPhotosFlag);
    } finally {
      setLoading(false);
    }
  };

  const processUserInput = (text: string, showPhotosFlag: boolean) => {
    if (currentFlow === "greeting") {
      if (text.toLowerCase().includes("latest trends") || text.toLowerCase().includes("trend")) {
        addBotMessage("Here are the latest fashion trends based on recent articles:");
        showBlogResults(MOCK_BLOG_POSTS.filter(post => post.tags.includes("Trending")), showPhotosFlag);
      } else if (text.toLowerCase().includes("fashion tips") || text.toLowerCase().includes("tips")) {
        addBotMessage("I've found these helpful fashion tips:");
        showBlogResults(MOCK_BLOG_POSTS.slice(0, 3), showPhotosFlag);
      } else if (text.toLowerCase().includes("style inspiration") || text.toLowerCase().includes("inspiration")) {
        addBotMessage("Looking for inspiration? Here are a few picks:");
        showBlogResults(MOCK_BLOG_POSTS.slice(2, 5), showPhotosFlag);
      } else if (text.toLowerCase().includes("preference") || text.toLowerCase().includes("set")) {
        setShowPreferences(true);
        setOptions([]);
      } else {
        const randomPosts = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 3);
        addBotMessage("Here are some fashion articles you might like:");
        showBlogResults(randomPosts, showPhotosFlag);
      }
    } else if (currentFlow === "preferences") {
      const preferenceFlow = CHATBOT_FLOWS.find(flow => flow.id === "season_preference");
      if (preferenceFlow) {
        addBotMessage(preferenceFlow.message);
        setOptions(preferenceFlow.options);
        setCurrentFlow("season_preference");
      }
    } else if (currentFlow === "season_preference") {
      const tagFlow = CHATBOT_FLOWS.find(flow => flow.id === "tag_preference");
      if (tagFlow) {
        addBotMessage(tagFlow.message);
        setOptions(tagFlow.options);
        setCurrentFlow("tag_preference");
      }
    } else if (currentFlow === "tag_preference") {
      addBotMessage("Thanks for setting your preferences! Here are some personalized recommendations:");
      const newPreferences = [
        { id: "tag", name: "Fashion Tag", value: text }
      ];
      setUserPreferences(newPreferences);
      const personalizedPosts = getRecommendedPosts(newPreferences);
      showBlogResults(personalizedPosts, showPhotosFlag);
      setCurrentFlow("greeting");
      const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
      if (greeting) {
        setOptions(greeting.options);
      }
    }
  };

  const showBlogResults = (posts: BlogPost[], displayMode: boolean) => {
    setRecommendedPosts(posts);
    setShowingResults(true);
    setShowPhotos(displayMode);
    setOptions([]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handlePreferencesChange = (newPreferences: UserPreference[]) => {
    setUserPreferences(newPreferences);
    if (newPreferences.length > 0) {
      const personalizedPosts = getRecommendedPosts(newPreferences);
      addBotMessage("Based on your preferences, here are some personalized recommendations:");
      showBlogResults(personalizedPosts, false);
    }
    setCurrentFlow("greeting");
    const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
    if (greeting) {
      setOptions(greeting.options);
    }
  };

  const CompactArticleList = ({ posts }: { posts: BlogPost[] }) => (
    <div className="my-3 space-y-2 ml-2">
      {posts.map(post => (
        <div 
          key={post.id} 
          className="flex items-center gap-2 border-l-4 border-fashion-pink bg-muted/70 rounded p-2"
        >
          <a 
            href={post.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-sm story-link text-fashion-pink"
          >
            {post.title}
          </a>
          <span className="text-xs text-muted-foreground ml-2">
            {post.source}
          </span>
        </div>
      ))}
      <Button
        size="sm"
        variant="ghost"
        className="mt-2 text-xs px-3 py-1.5"
        onClick={() => setShowPhotos(true)}
      >
        Show Photos
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-2 border-fashion-pink/20 bg-gradient-to-bl from-secondary/10 to-fashion-beige/40 backdrop-blur-2xl">
        <CardHeader className="px-6 py-4 border-b bg-gradient-to-r from-fashion-lavender/40 to-white/10 flex items-center gap-2">
          <MessageSquare className="text-fashion-pink mr-2" />
          <CardTitle className="text-xl text-center text-fashion-pink font-playfair tracking-tight drop-shadow">
            Style Savvy Scribe
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="flex flex-col p-4 relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-fashion-beige via-white/70 via-30% to-transparent opacity-40 -z-10" />
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
              />
            ))}
            {loading && (
              <div className="flex justify-center my-2">
                <Loader2 className="animate-spin text-fashion-pink" />
              </div>
            )}
            {options.length > 0 && (
              <div className="flex flex-wrap my-2 ml-12">
                {options.map((option) => (
                  <ChatOption
                    key={option}
                    text={option}
                    onClick={handleOptionClick}
                  />
                ))}
              </div>
            )}
            
            {showingResults && (
              <div className="my-4 space-y-4">
                {!showPhotos ? (
                  <CompactArticleList posts={recommendedPosts} />
                ) : (
                  <>
                    {recommendedPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                    <Button 
                      onClick={() => setShowPhotos(false)}
                      className="w-full mt-2"
                      variant="secondary"
                    >
                      Hide Photos
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => {
                    setShowingResults(false);
                    setOptions([
                      "Show me the latest trends",
                      "Give me some fashion tips",
                      "I want style inspiration",
                      "Set my preferences",
                    ]);
                    addBotMessage("Is there anything else you'd like to explore?");
                  }}
                  className="w-full mt-2"
                  variant="outline"
                >
                  Back to Chat
                </Button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <div className="p-4 border-t flex gap-2 bg-gradient-to-r from-fashion-lavender/10 via-white/60 to-white/20">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fashion trends or styles..."
            className="flex-1"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-fashion-pink hover:bg-fashion-pink/90"
            disabled={loading}
          >
            Send
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowPreferences(true)}
            disabled={loading}
          >
            Preferences
          </Button>
        </div>
      </Card>
      
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <UserPreferences
            preferences={userPreferences}
            onPreferencesChange={handlePreferencesChange}
            onClose={() => setShowPreferences(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
