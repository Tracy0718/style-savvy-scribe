
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

// Define message interface
interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const ChatInterface = () => {
  // State for messages, current input, and selected options
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [currentFlow, setCurrentFlow] = useState("greeting");
  const [showingResults, setShowingResults] = useState(false);
  const [recommendedPosts, setRecommendedPosts] = useState<BlogPost[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting message
  useEffect(() => {
    const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
    if (greeting) {
      addBotMessage(greeting.message);
      setOptions(greeting.options);
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    setInput("");
    
    // Simulate bot processing
    setTimeout(() => {
      processUserInput(input);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    
    // Simulate bot processing
    setTimeout(() => {
      processUserInput(option);
    }, 1000);
  };

  const processUserInput = (text: string) => {
    // Handle based on the current flow
    if (currentFlow === "greeting") {
      if (text.toLowerCase().includes("latest trends") || text.toLowerCase().includes("trend")) {
        addBotMessage("Here are the latest fashion trends based on recent blog posts:");
        showBlogResults(MOCK_BLOG_POSTS.filter(post => post.tags.includes("Trending")));
      } else if (text.toLowerCase().includes("fashion tips") || text.toLowerCase().includes("tips")) {
        addBotMessage("I've found these helpful fashion tips from popular blogs:");
        showBlogResults(MOCK_BLOG_POSTS.slice(0, 3));
      } else if (text.toLowerCase().includes("style inspiration") || text.toLowerCase().includes("inspiration")) {
        addBotMessage("Looking for inspiration? Check out these posts:");
        showBlogResults(MOCK_BLOG_POSTS.slice(2, 5));
      } else if (text.toLowerCase().includes("preference") || text.toLowerCase().includes("set")) {
        setShowPreferences(true);
        setOptions([]);
      } else {
        // Generic response for other inputs
        const randomPosts = [...MOCK_BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 3);
        addBotMessage("Here are some fashion articles you might find interesting:");
        showBlogResults(randomPosts);
      }
    } else if (currentFlow === "preferences") {
      // Handle preference selections
      const preferenceFlow = CHATBOT_FLOWS.find(flow => flow.id === "season_preference");
      if (preferenceFlow) {
        addBotMessage(preferenceFlow.message);
        setOptions(preferenceFlow.options);
        setCurrentFlow("season_preference");
      }
    } else if (currentFlow === "season_preference") {
      // Handle season selection
      const tagFlow = CHATBOT_FLOWS.find(flow => flow.id === "tag_preference");
      if (tagFlow) {
        addBotMessage(tagFlow.message);
        setOptions(tagFlow.options);
        setCurrentFlow("tag_preference");
      }
    } else if (currentFlow === "tag_preference") {
      // Final step in preference flow
      addBotMessage("Thanks for setting your preferences! Here are some personalized recommendations:");
      
      // Create mock preferences based on the conversation flow
      const newPreferences = [
        { id: "tag", name: "Fashion Tag", value: text }
      ];
      
      setUserPreferences(newPreferences);
      const personalizedPosts = getRecommendedPosts(newPreferences);
      showBlogResults(personalizedPosts);
      
      // Reset to greeting flow for next interaction
      setCurrentFlow("greeting");
      const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
      if (greeting) {
        setOptions(greeting.options);
      }
    }
  };

  const showBlogResults = (posts: BlogPost[]) => {
    setRecommendedPosts(posts);
    setShowingResults(true);
    setOptions([]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handlePreferencesChange = (newPreferences: UserPreference[]) => {
    setUserPreferences(newPreferences);
    
    // Show personalized results based on new preferences
    if (newPreferences.length > 0) {
      const personalizedPosts = getRecommendedPosts(newPreferences);
      
      addBotMessage("Based on your preferences, here are some personalized recommendations:");
      showBlogResults(personalizedPosts);
    }
    
    // Reset to greeting flow
    setCurrentFlow("greeting");
    const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
    if (greeting) {
      setOptions(greeting.options);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-xl text-center text-fashion-pink">
            Style Savvy Scribe
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="flex flex-col p-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
              />
            ))}
            
            {/* Options buttons */}
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
            
            {/* Blog post results */}
            {showingResults && (
              <div className="my-4 space-y-4">
                {recommendedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
                <Button 
                  onClick={() => {
                    setShowingResults(false);
                    
                    // Show options again
                    const greeting = CHATBOT_FLOWS.find(flow => flow.id === "greeting");
                    if (greeting) {
                      setOptions(greeting.options);
                    }
                    
                    addBotMessage("Is there anything else you'd like to explore?");
                  }}
                  className="w-full mt-2"
                >
                  Back to Chat
                </Button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        {/* Input area */}
        <div className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fashion trends or styles..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-fashion-pink hover:bg-fashion-pink/90"
          >
            Send
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowPreferences(true)}
          >
            Preferences
          </Button>
        </div>
      </Card>
      
      {/* Preferences modal */}
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
